import { useState, useCallback } from 'react';
import type { ValidationError } from '@api-banking/fixed-deposit.hooks.use-journey-context';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const DEFAULT_CLIENT_ID = process.env.CLIENT_ID || 'test-client-id';

export interface UseJourneySubmissionOptions {
    endpoint: string;
    method?: 'GET' | 'PUT' | 'POST';
    requiresAuth?: boolean;  // Whether to include Bearer token (default: false for public endpoints)
    clientId?: string;       // Client ID for the request
    onSuccess?: (response: any) => void;
    onError?: (errors: ValidationError[]) => void;
}

export interface UseJourneySubmissionReturn {
    submit: (data?: any, accessToken?: string) => Promise<boolean>;
    isLoading: boolean;
    errors: ValidationError[];
    clearErrors: () => void;
}

export function useJourneySubmission({
    endpoint,
    method = 'PUT',
    requiresAuth = false,
    clientId = DEFAULT_CLIENT_ID,
    onSuccess,
    onError,
}: UseJourneySubmissionOptions): UseJourneySubmissionReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    const submit = useCallback(async (data?: any, accessToken?: string): Promise<boolean> => {
        setIsLoading(true);
        setErrors([]);

        try {
            // Build headers
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Client-Id': clientId,
            };

            // Add Bearer token for protected routes
            if (requiresAuth && accessToken) {
                headers.Authorization = `Bearer ${accessToken}`;
            }

            const fetchOptions: RequestInit = {
                method,
                headers,
                credentials: 'include',
            };

            // Only add body for non-GET requests
            if (method !== 'GET' && data !== undefined) {
                fetchOptions.body = JSON.stringify(data);
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

            const result = await response.json();

            if (!response.ok) {
                // Handle error response format (errors array without success field)
                const validationErrors = result.errors || [{ field: 'general', message: 'An error occurred' }];
                setErrors(validationErrors);
                onError?.(validationErrors);
                return false;
            }

            // Handle success - some endpoints return {success: true}, others just return data
            if (result.success === false) {
                const validationErrors = result.errors || [{ field: 'general', message: 'An error occurred' }];
                setErrors(validationErrors);
                onError?.(validationErrors);
                return false;
            }

            onSuccess?.(result);
            return true;
        } catch (error) {
            const networkError = [{ field: 'general', message: 'Network error. Please try again.' }];
            setErrors(networkError);
            onError?.(networkError);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, method, requiresAuth, clientId, onSuccess, onError]);

    return {
        submit,
        isLoading,
        errors,
        clearErrors,
    };
}

// Helper hook for fetching terms (GET request, no auth)
export function useTermsFetch(clientId?: string) {
    return useJourneySubmission({
        endpoint: '/login/terms',
        method: 'GET',
        requiresAuth: false,
        clientId,
    });
}

// Helper hook for login authorization (POST request, no auth)
export function useLoginAuthorize(clientId?: string) {
    return useJourneySubmission({
        endpoint: '/login/authorize',
        method: 'POST',
        requiresAuth: false,
        clientId,
    });
}

// Helper hook for token exchange (POST request, no auth)
export function useTokenExchange(clientId?: string) {
    return useJourneySubmission({
        endpoint: '/login/token',
        method: 'POST',
        requiresAuth: false,
        clientId,
    });
}

// Helper hook for fetching journey config (GET request, requires auth)
export function useJourneyConfig(clientId?: string) {
    return useJourneySubmission({
        endpoint: '/my/journey/config',
        method: 'GET',
        requiresAuth: true,
        clientId,
    });
}
