import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import {
    saveFormData,
    getFormData,
    clearAll as clearSessionStorage,
    saveCurrentStep,
    getCurrentStep,
    saveAccessToken,
    getAccessToken as getStoredAccessToken,
    saveCustomerId,
    getCustomerId as getStoredCustomerId,
    saveRefreshToken,
    getRefreshToken as getStoredRefreshToken,
    hasStoredSession,
    isExpired,
} from '@api-banking/fixed-deposit.utils.session-storage';
import { clearAllCookies } from '@api-banking/fixed-deposit.utils.cookie-utils';
import { useStitchClientWithFallback, isTokenExpiringSoon } from '@api-banking/stitch.stitch-client';
import type { CustomerAccount } from '@api-banking/stitch.stitch-client';

export interface ValidationError {
    field: string;
    message: string;
}

export interface Term {
    id: string;
    summary: string;
    documentUrl?: string;
    content?: string;
}

export interface JourneyConfig {
    journeyType: string;
    requiredAggregates: Array<{
        key: string;
        label: string;
        fields: Record<string, unknown>;
    }>;
    stepTitles: string[];
    components: Record<string, {
        id: string;
        type: string;
        props?: Record<string, unknown>;
    }>;
    layout: {
        type: string;
        config?: Record<string, unknown>;
        children?: Array<{ componentId: string }>;
    };
    logoUrl?: string;
    interestRatesUrl?: string;
    theme?: {
        colors?: {
            primary?: { default?: string; hover?: string; active?: string };
            secondary?: { default?: string; hover?: string; active?: string };
            surface?: { background?: string; primary?: string; secondary?: string };
            surfaceDark?: { default?: string; hover?: string; active?: string };
        };
    };
}

type AuthenticationContextType = {
    formData: Record<string, any>;
    updateFormData: (stepId: string, data: any) => void;
    token: string | null;
    setToken: (token: string) => void;

    // Terms from server
    terms: Term[];
    setTerms: (terms: Term[]) => void;
    isLoadingTerms: boolean;
    setLoadingTerms: (loading: boolean) => void;

    // Access token (replaces tempToken)
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    refreshToken: string | null;
    setRefreshToken: (token: string | null) => void;

    // Customer ID (decoded from JWT)
    customerId: string | null;
    setCustomerId: (id: string | null) => void;

    // Customer accounts (from Stitch API)
    customerAccounts: CustomerAccount[];
    setCustomerAccounts: (accounts: CustomerAccount[]) => void;

    // OTP session metadata
    otpSessionId: string | null;
    setOtpSessionId: (id: string | null) => void;
    otpHint: string | null;
    setOtpHint: (hint: string | null) => void;
    otpLength: number;
    setOtpLength: (length: number) => void;
    otpMaxAttempts: number;
    setOtpMaxAttempts: (max: number) => void;

    // Session ID (for legacy compatibility)
    sessionId: string | null;
    setSessionId: (id: string | null) => void;

    // Server validation state
    serverErrors: Record<string, ValidationError[]>;
    setServerErrors: (stepId: string, errors: ValidationError[]) => void;
    clearServerErrors: (stepId: string) => void;
    isSubmitting: boolean;
    setSubmitting: (isSubmitting: boolean) => void;

    // Journey config from backend
    journeyConfig: JourneyConfig | null;
    setJourneyConfig: (config: JourneyConfig) => void;

    // Client configuration
    clientId: string;

    // Session persistence
    isRestoring: boolean;
    hasResumableSession: boolean;
    savedStep: number | null;
    persistSession: () => void;
    restoreSession: () => Promise<{ formData: Record<string, any>; step: number } | null>;
    clearSession: () => void;

    // Token refresh
    refreshAccessToken: () => Promise<boolean>;
    isRefreshing: boolean;

    /**
     * Execute an API call with automatic token refresh on 401 errors.
     * If a 401 is received, refreshes the token and retries the call once.
     *
     * @param apiCall - Function that makes the API call, receives accessToken
     * @returns The result of the API call
     */
    withTokenRefresh: <T>(apiCall: (accessToken: string) => Promise<T>) => Promise<T>;
};

const DEFAULT_CLIENT_ID = process.env.CLIENT_ID || 'test-client-id';

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export function AuthenticationProvider({ children, clientId = DEFAULT_CLIENT_ID }: { children: ReactNode; clientId?: string }) {
    const stitchClient = useStitchClientWithFallback();

    const [formData, setFormData] = useState<Record<string, any>>({});
    const [token, setToken] = useState<string | null>(null);

    // Terms state
    const [terms, setTerms] = useState<Term[]>([]);
    const [isLoadingTerms, setLoadingTerms] = useState(false);

    // Token state (replaces tempToken)
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Track if a refresh is in progress to prevent multiple concurrent refreshes
    const refreshPromiseRef = useRef<Promise<boolean> | null>(null);

    // Customer ID (decoded from JWT)
    const [customerId, setCustomerId] = useState<string | null>(null);

    // Customer accounts (from Stitch API)
    const [customerAccounts, setCustomerAccounts] = useState<CustomerAccount[]>([]);

    // OTP session metadata
    const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
    const [otpHint, setOtpHint] = useState<string | null>(null);
    const [otpLength, setOtpLength] = useState(6);
    const [otpMaxAttempts, setOtpMaxAttempts] = useState(3);

    // Legacy session ID
    const [sessionId, setSessionId] = useState<string | null>(null);

    const [serverErrors, setServerErrorsState] = useState<Record<string, ValidationError[]>>({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [journeyConfig, setJourneyConfig] = useState<JourneyConfig | null>(null);

    // Session persistence state
    const [isRestoring, setIsRestoring] = useState(false);
    const [hasResumableSession, setHasResumableSession] = useState(false);
    const [savedStep, setSavedStep] = useState<number | null>(null);

    // Check for resumable session on mount
    useEffect(() => {
        const checkForResumableSession = () => {
            if (hasStoredSession() && !isExpired()) {
                setHasResumableSession(true);
                const storedStep = getCurrentStep();
                setSavedStep(storedStep);
                // Also check for stored access token (fallback for cookies)
                const storedToken = getStoredAccessToken();
                if (storedToken) {
                    setAccessTokenState(storedToken);
                }
                const storedCustomerId = getStoredCustomerId();
                if (storedCustomerId) {
                    setCustomerId(storedCustomerId);
                }
                const storedRefreshToken = getStoredRefreshToken();
                if (storedRefreshToken) {
                    setRefreshTokenState(storedRefreshToken);
                }
            } else {
                setHasResumableSession(false);
                setSavedStep(null);
            }
        };
        checkForResumableSession();
    }, []);

    // Auto-persist formData changes to sessionStorage
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            saveFormData(formData);
        }
    }, [formData]);

    // Custom setAccessToken that also saves to sessionStorage (fallback for cookies)
    const setAccessToken = useCallback((newToken: string | null) => {
        setAccessTokenState(newToken);
        if (newToken) {
            saveAccessToken(newToken);
        }
    }, []);

    // Custom setCustomerId that also saves to sessionStorage
    const setCustomerIdWithPersist = useCallback((id: string | null) => {
        setCustomerId(id);
        if (id) {
            saveCustomerId(id);
        }
    }, []);

    // Wrapper for setRefreshToken that also saves to sessionStorage
    const setRefreshToken = useCallback((newToken: string | null) => {
        setRefreshTokenState(newToken);
        if (newToken) {
            saveRefreshToken(newToken);
        }
    }, []);

    // Refresh access token using the refresh token
    const refreshAccessTokenFn = useCallback(async (): Promise<boolean> => {
        // If already refreshing, wait for the existing promise
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        if (!refreshToken) {
            console.warn('No refresh token available');
            return false;
        }

        setIsRefreshing(true);

        const refreshPromise = (async () => {
            try {
                const response = await stitchClient.refreshAccessToken(refreshToken);

                if (response.accessToken) {
                    setAccessToken(response.accessToken);
                    if (response.refreshToken) {
                        setRefreshToken(response.refreshToken);
                    }
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Token refresh failed:', error);
                return false;
            } finally {
                setIsRefreshing(false);
                refreshPromiseRef.current = null;
            }
        })();

        refreshPromiseRef.current = refreshPromise;
        return refreshPromise;
    }, [refreshToken, stitchClient, setAccessToken, setRefreshToken]);

    // Track latest access token via ref (needed because refresh updates state async)
    const accessTokenRef = useRef<string | null>(null);
    useEffect(() => { accessTokenRef.current = accessToken; }, [accessToken]);

    // Proactive token refresh — checks JWT expiry before each request
    const ensureFreshToken = useCallback(async (): Promise<string | undefined> => {
        const currentToken = accessTokenRef.current;
        if (!currentToken) return undefined;

        if (isTokenExpiringSoon(currentToken, 60)) {
            const refreshed = await refreshAccessTokenFn();
            return refreshed ? (accessTokenRef.current ?? undefined) : undefined;
        }

        return currentToken;
    }, [refreshAccessTokenFn]);

    // Wire proactive token refresh into the stitch client
    useEffect(() => {
        stitchClient.setTokenProvider(ensureFreshToken);
        return () => { stitchClient.setTokenProvider(null); };
    }, [stitchClient, ensureFreshToken]);

    // Execute API call with automatic token refresh on 401
    const withTokenRefresh = useCallback(async <T,>(
        apiCall: (accessToken: string) => Promise<T>
    ): Promise<T> => {
        if (!accessToken) {
            throw new Error('No access token available');
        }

        try {
            const result = await apiCall(accessToken);

            // Check if result indicates a 401 error
            // Handle both { status: 401 } and { errors: [{ ... }] } patterns
            if (
                result &&
                typeof result === 'object' &&
                'status' in result &&
                (result as any).status === 401
            ) {
                throw new Error('Unauthorized');
            }

            return result;
        } catch (error) {
            // Check if it's a 401 error
            const is401 = error instanceof Error && (
                error.message === 'Unauthorized' ||
                error.message.includes('401')
            );

            if (is401 && refreshToken) {
                // Attempt token refresh
                const refreshed = await refreshAccessTokenFn();

                if (refreshed && accessToken) {
                    // Retry with the new token (accessToken state will be updated)
                    // Need to get the latest token from state
                    const newToken = accessToken; // This will be the refreshed token
                    return apiCall(newToken);
                }
            }

            throw error;
        }
    }, [accessToken, refreshToken, refreshAccessTokenFn]);

    const updateFormData = (stepId: string, data: any) => {
        setFormData((prev) => ({ ...prev, [stepId]: data }));
    };

    const setServerErrors = (stepId: string, errors: ValidationError[]) => {
        setServerErrorsState((prev) => ({ ...prev, [stepId]: errors }));
    };

    const clearServerErrors = (stepId: string) => {
        setServerErrorsState((prev) => {
            const next = { ...prev };
            delete next[stepId];
            return next;
        });
    };

    // Persist current session state
    const persistSession = useCallback(() => {
        if (Object.keys(formData).length > 0) {
            saveFormData(formData);
        }
    }, [formData]);

    // Restore session from storage
    const restoreSession = useCallback(async (): Promise<{ formData: Record<string, any>; step: number } | null> => {
        setIsRestoring(true);
        try {
            const storedFormData = getFormData();
            const storedStep = getCurrentStep();
            const storedToken = getStoredAccessToken();

            // Check if session is expired
            if (isExpired()) {
                clearSessionStorage();
                setHasResumableSession(false);
                return null;
            }

            // Check if there's anything to restore (form data OR a saved step > 0)
            const hasFormData = storedFormData && Object.keys(storedFormData).length > 0;
            const hasStep = storedStep !== null && storedStep > 0;

            if (!hasFormData && !hasStep) {
                clearSessionStorage();
                setHasResumableSession(false);
                return null;
            }

            // Restore state
            if (hasFormData) {
                setFormData(storedFormData);
            }
            if (storedToken) {
                setAccessTokenState(storedToken);
            }
            const storedCustomerId = getStoredCustomerId();
            if (storedCustomerId) {
                setCustomerId(storedCustomerId);
            }
            const storedRefreshToken = getStoredRefreshToken();
            if (storedRefreshToken) {
                setRefreshTokenState(storedRefreshToken);
            }

            setHasResumableSession(false);
            return {
                formData: storedFormData || {},
                step: storedStep ?? 1, // Default to step 1 (deposit details) if no step saved
            };
        } finally {
            setIsRestoring(false);
        }
    }, []);

    // Clear all session data
    const clearSession = useCallback(() => {
        // Clear React state
        setFormData({});
        setAccessTokenState(null);
        setRefreshToken(null);
        setCustomerId(null);
        setCustomerAccounts([]);
        setOtpSessionId(null);
        setOtpHint(null);
        setSessionId(null);
        setServerErrorsState({});
        setHasResumableSession(false);
        setSavedStep(null);

        // Clear storage
        clearSessionStorage();
        clearAllCookies();
    }, []);

    // Save current step when it changes (called from stepper)
    const persistCurrentStep = useCallback((step: number) => {
        saveCurrentStep(step);
        setSavedStep(step);
    }, []);

    return (
        <AuthenticationContext.Provider value={{
            formData,
            updateFormData,
            token,
            setToken,
            // Terms
            terms,
            setTerms,
            isLoadingTerms,
            setLoadingTerms,
            // Tokens
            accessToken,
            setAccessToken,
            refreshToken,
            setRefreshToken,
            // Customer ID
            customerId,
            setCustomerId: setCustomerIdWithPersist,
            // Customer accounts
            customerAccounts,
            setCustomerAccounts,
            // OTP session
            otpSessionId,
            setOtpSessionId,
            otpHint,
            setOtpHint,
            otpLength,
            setOtpLength,
            otpMaxAttempts,
            setOtpMaxAttempts,
            // Legacy
            sessionId,
            setSessionId,
            // Errors
            serverErrors,
            setServerErrors,
            clearServerErrors,
            isSubmitting,
            setSubmitting,
            journeyConfig,
            setJourneyConfig,
            // Client config
            clientId,
            // Session persistence
            isRestoring,
            hasResumableSession,
            savedStep,
            persistSession,
            restoreSession,
            clearSession,
            // Token refresh
            refreshAccessToken: refreshAccessTokenFn,
            isRefreshing,
            withTokenRefresh,
        }}>
            {children}
        </AuthenticationContext.Provider>
    );
}

export function useJourneyContext() {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error('useJourneyContext must be used within an AuthenticationProvider');
    }
    return context;
}
