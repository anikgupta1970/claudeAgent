/**
 * Stitch API Client using Hono RPC
 *
 * This client uses hono/client for fully typed API calls
 * that automatically match the server's route definitions.
 *
 * All methods use Hono RPC - types are inferred from route definitions.
 */

import { hc } from 'hono/client';
import type { AppType } from '@api-banking/stitch.stitch-api';

/** Decode JWT payload without verification (for expiry check only) */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

/** Check if token is expired or will expire within bufferSeconds */
export function isTokenExpiringSoon(token: string, bufferSeconds = 60): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp - Math.floor(Date.now() / 1000) < bufferSeconds;
}

export interface StitchClientConfig {
  /**
   * Base URL for the Stitch API proxy server
   * @default 'http://localhost:5000'
   */
  baseUrl?: string;

  /**
   * Bearer token for authenticated requests
   */
  token?: string;

  /**
   * Client ID header value
   */
  clientId?: string;
}

export type StitchClient = ReturnType<typeof createStitchClient>;

/**
 * Creates a typed Stitch API client
 */
export function createStitchClient(config: StitchClientConfig = {}) {
  const {
    baseUrl = process.env.VITE_STITCH_API_BASE_URL ||
      'https://my-hono-api-bitignacio-dev.apps.rm3.7wse.p1.openshiftapps.com',
    token,
    clientId,
  } = config;

  // Mutable token provider — set by AuthenticationProvider at runtime
  let tokenProvider: (() => Promise<string | undefined>) | null = null;

  /** Get a valid token, refreshing proactively if close to expiry */
  const getFreshToken = async (overrideToken?: string): Promise<string | undefined> => {
    if (overrideToken) return overrideToken;
    if (tokenProvider) return tokenProvider();
    return token;
  };

  // Build headers for requests (accessToken param overrides config token)
  const getHeaders = (accessToken?: string): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const effectiveToken = accessToken ?? token;
    if (effectiveToken) {
      headers.Authorization = `Bearer ${effectiveToken}`;
    }

    if (clientId) {
      headers['Client-Id'] = clientId;
    }

    return headers;
  };

  // Create the Hono RPC client with custom headers
  const client = hc<AppType>(baseUrl, {
    headers: () => getHeaders(),
  });

  // Create a client with overridden accessToken
  const withToken = (accessToken?: string) => {
    if (!accessToken) return client;
    return hc<AppType>(baseUrl, { headers: () => getHeaders(accessToken) });
  };

  return {
    /**
     * Set a token provider for proactive token refresh.
     * Called by AuthenticationProvider to wire in refresh logic.
     */
    setTokenProvider(provider: (() => Promise<string | undefined>) | null) {
      tokenProvider = provider;
    },
    /**
     * Raw Hono RPC client for direct access to all endpoints
     */
    raw: client,

    // ============================================
    // Auth endpoints (OpenAPI spec - typed)
    // ============================================

    getTokenClaims: async (data: {
      mobile: string;
      dob?: string;
      pan?: string;
    }) => {
      const res = await client.auth.token.claims.$post({ json: data as any });
      return res.json();
    },

    // ============================================
    // Individual Customer endpoints (OpenAPI spec - typed)
    // ============================================

    findCustomer: async (data: {
      mobile: string;
      dob?: string;
      pan?: string;
    }) => {
      const res = await client['individual-customers'].find.$post({
        json: data,
      });
      return res.json();
    },

    getProfile: async (customerId: string, accessToken?: string) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken)[
        'individual-customers'
      ].info.profile.$post({
        json: { customerId },
      });
      return res.json();
    },

    getAccounts: async (data: {
      customerId: string;
      permission?: 'debit';
      currency?: string;
    }) => {
      const freshToken = await getFreshToken();
      const res = await withToken(freshToken)['individual-customers'].info.accounts.$post({
        json: {
          customerId: data.customerId,
          permission: data.permission || 'debit',
          currency: data.currency || 'INR',
        },
      });
      return res.json();
    },

    calculateFD: async (data: {
      customerId: string;
      productVariant: string;
      depositAmount: { amount: number; currency: string };
      tenure: string;
      interestPaymentOption: 'at_maturity' | 'monthly' | 'quarterly';
      maturityInstruction: {
        option: 'close' | 'renew' | 'transfer';
        renewalOption?: 'full' | 'principal';
      };
    }) => {
      const freshToken = await getFreshToken();
      const res = await withToken(freshToken)['individual-customers'].fd.calculator.$post({
        json: data,
      });
      return res.json();
    },

    verifyBankAccount: async (
      data: {
        customerId: string;
        accountNo: string;
        ifsc: string;
      },
      accessToken?: string
    ) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken)[
        'individual-customers'
      ].verifications['bank-account'].$post({
        json: data,
      });
      return res.json() as Promise<{
        status: string;
        accountNo?: string;
        ifsc?: string;
        customerName?: string;
      }>;
    },

    verifyUpiVpa: async (
      data: { customerId: string; vpa: string },
      accessToken?: string
    ) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken)[
        'individual-customers'
      ].verifications['upi-vpa'].$post({
        json: data,
      });
      return res.json();
    },

    // ============================================
    // Forms endpoints (OpenAPI spec - typed)
    // ============================================

    submitForm: async (
      data: {
        instructions: unknown[];
        sections: unknown[];
      },
      accessToken?: string
    ) => {
      const freshToken = await getFreshToken(accessToken);
      const headers = getHeaders(freshToken);
      headers['Idempotency-Key'] = crypto.randomUUID();

      const res = await fetch(`${baseUrl}/forms`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },

    getFormStatus: async (applicationId: string) => {
      const freshToken = await getFreshToken();
      const res = await withToken(freshToken).forms.status.$post({
        json: { applicationId },
      });
      return res.json();
    },

    getFormDetailedStatus: async (applicationId: string) => {
      const freshToken = await getFreshToken();
      const res = await withToken(freshToken).forms['detailed-status'].$post({
        json: { applicationId },
      });
      return res.json();
    },

    // ============================================
    // Payment endpoints (OpenAPI spec - typed)
    // ============================================

    /**
     * Initiate payment
     *
     * Note: The payment API may return either:
     * - JSON with paymentLink object (for redirect flows)
     * - Raw HTML form (for CCAvenue direct POST flows)
     *
     * This method detects the response type and returns appropriately:
     * - For JSON: returns the parsed JSON object
     * - For HTML: returns { htmlForm: string } with the raw HTML
     */
    initiatePayment: async (data: {
      customerId: string;
      clientReferenceNumber: string;
      clientSuccessUrl: string;
      clientFailureUrl: string;
      method: 'cash' | 'cheque' | 'upi' | 'transfer' | 'net_banking';
      amount: { amount: number; currency: string };
      instrument?: {
        accountNo: string;
        ifsc?: string;
        customerName?: string;
        vpa?: string;
      };
    }): Promise<{
      paymentLink: {
        url: string;
        method?: string;
        parameters?: Record<string, string>;
      };
      htmlForm?: string;
    }> => {
      // Use raw fetch instead of Hono RPC to ensure Accept header is sent
      // and to handle both JSON and HTML responses from the payment gateway
      const freshToken = await getFreshToken();
      const headers = getHeaders(freshToken);
      headers.Accept = 'application/json';
      headers['Idempotency-Key'] = crypto.randomUUID();

      const res = await fetch(`${baseUrl}/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get('content-type') || '';
      const responseText = await res.text();

      // If the upstream returned HTML (e.g. CCAvenue payment form), wrap it
      if (
        contentType.includes('text/html') ||
        responseText.trimStart().startsWith('<!')
      ) {
        return { paymentLink: { url: '' }, htmlForm: responseText };
      }

      return JSON.parse(responseText);
    },

    getPaymentStatus: async (data: {
      clientReferenceNumber?: string;
      paymentTxnId?: string;
    }) => {
      const freshToken = await getFreshToken();
      const res = await withToken(freshToken).payments.status.$post({ json: data });
      return res.json() as Promise<{
        paymentTxnId?: string;
        status?: string;
        clientReferenceNumber?: string;
      }>;
    },

    // ============================================
    // Login endpoints (legacy - from stubs)
    // ============================================

    getLoginTerms: async () => {
      const res = await client.login.terms.$get();
      return res.json();
    },

    authorize: async (data: {
      acceptedTerms: Array<{ id: string }>;
      credential: {
        type: string;
        mobile?: string;
        dob?: string;
        pan?: string;
      };
    }) => {
      const res = await client.login.authorize.$post({ json: data });
      return res.json();
    },

    exchangeToken: async (data: { sessionId: string; otp: string }) => {
      const res = await client.login.token.$post({ json: data });
      return res.json() as Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType?: string;
        expiresIn?: number;
      }>;
    },

    refreshAccessToken: async (refreshToken: string) => {
      const res = await client.token.exchange.$post({ json: { refreshToken } });
      return res.json() as Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType?: string;
        expiresIn?: number;
      }>;
    },

    // ============================================
    // Processing endpoints (token generation)
    // ============================================

    generateStitchToken: async (
      customerId: string,
      overrideClientId: string = '456'
    ) => {
      const res = await client.processing.token.$post({
        json: {
          claims: {
            customer_id: customerId,
            client_id: overrideClientId,
          },
        },
      });
      return res.json();
    },

    // ============================================
    // Product endpoints (legacy - from stubs)
    // ============================================

    getProducts: async () => {
      const res = await client.my.products.$get();
      return res.json();
    },

    getFDProducts: async (_variant?: string) => {
      const res = await client.my.products.fd.$get();
      return res.json();
    },

    getSAProducts: async (_variant?: string) => {
      const res = await client.my.products.sa.$get();
      return res.json();
    },

    // ============================================
    // Location endpoints (legacy - from stubs)
    // ============================================

    getStates: async (params?: { country?: string; facility?: string }) => {
      const res = await client.locations.states.$get({
        query: (params as Record<string, string>) || {},
      });
      return res.json();
    },

    getDistricts: async (params: {
      country: string;
      state: string;
      facility?: string;
    }) => {
      const res = await client.locations.districts.$get({
        query: params as Record<string, string>,
      });
      return res.json();
    },

    getCities: async (params: {
      country: string;
      state: string;
      district?: string;
      facility?: string;
    }) => {
      const res = await client.locations.cities.$get({
        query: params as Record<string, string>,
      });
      return res.json();
    },

    getBranches: async (params?: {
      country?: string;
      state?: string;
      city?: string;
      district?: string;
      pin?: string;
    }) => {
      const res = await client.branches.$get({
        query: (params || {}) as Record<string, string>,
      });
      return res.json();
    },

    getBranchesByPincode: async (params: {
      country: string;
      postalCode: string;
    }) => {
      const res = await client.branches.$get({
        query: {
          country: params.country,
          postalCode: params.postalCode,
        },
      });
      return res.json();
    },

    getBranchesByLocation: async (params: {
      country: string;
      state: string;
      city: string;
    }) => {
      const res = await client.branches.$get({
        query: {
          country: params.country,
          state: params.state,
          city: params.city,
        },
      });
      return res.json();
    },

    getBranchStates: async (params?: { country?: string }) => {
      const res = await client.branches.states.$get({
        query: { country: params?.country || 'IN' },
      });
      return res.json() as Promise<{ states: string[] }>;
    },

    getBranchCities: async (params: { country?: string; state: string }) => {
      const res = await client.branches.cities.$get({
        query: { country: params.country || 'IN', state: params.state },
      });
      return res.json() as Promise<{ cities: string[] }>;
    },

    // ============================================
    // Mock endpoints (not in OpenAPI spec or stubs)
    // ============================================

    getJourneyConfig: async (tenant?: string) => {
      const res = await client.journey.config.$get({
        query: { tenant: tenant || '' },
      });
      return res.json();
    },

    saveDepositDetails: async (
      data: {
        fdType: 'withdrawable' | 'non-withdrawable';
        amount: string;
        interestPayout: 'at-maturity' | 'monthly' | 'quarterly';
        maturityInstructions: string;
        tenureYears: string;
        tenureMonths: string;
        tenureDays: string;
      },
      accessToken?: string
    ) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken).my.fd.details.deposit.$put({
        json: data,
      });
      return res.json();
    },

    saveBankDetails: async (
      data: {
        fundingOption: 'other-bank' | 'primary-bank' | 'combined-funds';
        primaryAmount?: string;
        otherBankAccount?: string;
        branch: string;
        addNominee: boolean;
      },
      accessToken?: string
    ) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken).my.fd.details.bank.$put({
        json: data,
      });
      return res.json();
    },

    submitFD: async (accessToken?: string) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken).my.fd.submit.$post({ json: {} });
      return res.json();
    },

    getSession: async (accessToken?: string) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken).my.fd.session.$get();
      return res.json();
    },

    lookupIFSC: async (ifscCode: string) => {
      const res = await client.ifsc[':code'].$get({
        param: { code: ifscCode },
      });
      return res.json();
    },

    getTranslations: async (lang: string) => {
      const res = await client.translations[':lang'].$get({ param: { lang } });
      return res.json();
    },

    verifyAccount: async (data: { accountNumber: string; ifsc: string }) => {
      const res = await client.account.verify.$post({ json: data });
      return res.json();
    },

    findCustomerWithToken: async (
      data: {
        mobile: string;
        dob?: string;
        pan?: string;
      },
      accessToken?: string
    ) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken)[
        'individual-customers'
      ].find.$post({
        json: data,
      });
      return res.json() as Promise<{
        customerId: string;
        name: string;
        mobile: string;
      }>;
    },

    getCustomerAccounts: async (
      data: {
        customerId: string;
        permission?: 'debit';
        currency?: string;
      },
      accessToken?: string
    ) => {
      const freshToken = await getFreshToken(accessToken);
      const res = await withToken(freshToken)[
        'individual-customers'
      ].info.accounts.$post({
        json: {
          customerId: data.customerId,
          permission: data.permission || 'debit',
          currency: data.currency || 'INR',
        },
      });
      return res.json();
    },

    /**
     * Calculate FD (legacy format - matches old API client signature)
     * Converts legacy format to real Stitch API format and calls /individual-customers/fd/calculator.
     */
    calculateFDLegacy: async (
      data: {
        amount: string;
        tenureYears: string;
        tenureMonths: string;
        tenureDays: string;
        interestPayout: 'at-maturity' | 'monthly' | 'quarterly';
        fdType: 'withdrawable' | 'non-withdrawable';
      },
      customerId?: string,
      productVariant: string = 'regular',
      maturityInstruction?: {
        option: string;
        renewalOption?: string;
        payoutAccountId?: string;
        managersCheque?: boolean;
      },
      accessToken?: string
    ) => {
      const freshToken = await getFreshToken(accessToken);
      // If no customerId provided, fallback to mock endpoint
      if (!customerId) {
        const res = await withToken(freshToken).my.fd.calculator.$post({
          json: data,
        });
        return res.json();
      }

      // Convert tenure to ISO 8601 duration format (e.g., "P1Y6M3D")
      const years = parseInt(data.tenureYears, 10) || 0;
      const months = parseInt(data.tenureMonths, 10) || 0;
      const days = parseInt(data.tenureDays, 10) || 0;
      let tenure = 'P';
      if (years > 0) tenure += `${years}Y`;
      if (months > 0) tenure += `${months}M`;
      if (days > 0) tenure += `${days}D`;
      if (tenure === 'P') tenure = 'P0D'; // At least one component required

      // Convert interestPayout from "at-maturity" to "at_maturity"
      const interestPaymentOption =
        data.interestPayout === 'at-maturity'
          ? 'at_maturity'
          : data.interestPayout;

      // Build the real API request
      const apiRequest = {
        customerId,
        productVariant,
        depositAmount: {
          amount: Number(data.amount),
          currency: 'INR',
        },
        tenure,
        interestPaymentOption: interestPaymentOption as
          | 'at_maturity'
          | 'monthly'
          | 'quarterly',
        maturityInstruction: {
          option: (maturityInstruction?.option || 'close') as
            | 'close'
            | 'renew'
            | 'transfer',
          ...(maturityInstruction?.renewalOption && {
            renewalOption: maturityInstruction.renewalOption as
              | 'full'
              | 'principal',
          }),
          ...(maturityInstruction?.payoutAccountId && {
            payoutAccountId: maturityInstruction.payoutAccountId,
          }),
          ...(maturityInstruction?.managersCheque !== undefined && {
            managersCheque: maturityInstruction.managersCheque,
          }),
        },
      };

      const res = await withToken(freshToken)[
        'individual-customers'
      ].fd.calculator.$post({
        json: apiRequest,
      });
      return res.json();
    },
  };
}

/**
 * Default client instance
 */
export const stitchClient = createStitchClient();
