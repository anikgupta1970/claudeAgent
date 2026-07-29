// API Client implementation with mock mode support

import type {
  ApiClient,
  ApiClientConfig,
  ApiResponse,
  TermsResponse,
  AuthorizeRequest,
  AuthorizeResponse,
  TokenRequest,
  TokenResponse,
  JourneyConfigResponse,
  DepositRequest,
  BankRequest,
  SuccessResponse,
  FDCalculatorRequest,
  FDCalculatorResponse,
  SubmitResponse,
  BranchesRequest,
  BranchesResponse,
  SessionResponse,
  IFSCLookupResponse,
  AccountVerifyRequest,
  AccountVerifyResponse,
  CustomerAccountsRequest,
  CustomerAccount,
  TranslationsResponse,
  NomineeResponse,
} from './types.js';

import {
  mockTermsResponse,
  mockAuthorizeResponse,
  mockTokenResponse,
  mockJourneyConfigResponse,
  mockSuccessResponse,
  mockCalculatorResponse,
  mockSubmitResponse,
  mockBranchesResponse,
  mockSessionResponse,
  mockIFSCLookupResponse,
  mockAccountVerifyResponse,
  mockCustomerAccountsResponse,
  mockNomineeResponse,
  mockTranslationsResponse,
} from './mock-responses.js';

const DEFAULT_BASE_URL = 'http://localhost:5000';
const DEFAULT_CLIENT_ID = 'test-client-id';

// Simulate network delay for mock responses
const mockDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Check if running on Bit Cloud preview environment
function isBitCloudPreview(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname.endsWith('.bit-app.dev') ||
    window.location.hostname.endsWith('.composed.app')
  );
}

export function createApiClient(config: ApiClientConfig = {}): ApiClient {
  const {
    baseUrl = process.env.API_BASE_URL || DEFAULT_BASE_URL,
    clientId = process.env.CLIENT_ID || DEFAULT_CLIENT_ID,
    mock = false,
  } = config;

  // Auto-enable mock mode on Bit Cloud previews
  const shouldMock = mock || isBitCloudPreview();

  // Helper for making authenticated requests
  async function fetchWithAuth<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT';
      body?: unknown;
      accessToken?: string;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, accessToken } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Client-Id': clientId,
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (body !== undefined && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: result.errors || [
          { field: 'general', message: 'An error occurred' },
        ],
      };
    }

    return result;
  }

  // Mock implementation
  if (shouldMock) {
    return {
      async getTerms(): Promise<ApiResponse<TermsResponse>> {
        await mockDelay();
        return mockTermsResponse;
      },

      async authorize(
        _data: AuthorizeRequest
      ): Promise<ApiResponse<AuthorizeResponse>> {
        await mockDelay(500);
        return mockAuthorizeResponse;
      },

      async exchangeToken(
        _data: TokenRequest
      ): Promise<ApiResponse<TokenResponse>> {
        await mockDelay(500);
        return mockTokenResponse;
      },

      async getJourneyConfig(): Promise<ApiResponse<JourneyConfigResponse>> {
        await mockDelay();
        return mockJourneyConfigResponse;
      },

      async saveDepositDetails(
        _data: DepositRequest,
        _accessToken: string
      ): Promise<ApiResponse<SuccessResponse>> {
        await mockDelay(500);
        return mockSuccessResponse;
      },

      async saveBankDetails(
        _data: BankRequest,
        _accessToken: string
      ): Promise<ApiResponse<SuccessResponse>> {
        await mockDelay(500);
        return mockSuccessResponse;
      },

      async submitFD(
        _accessToken: string
      ): Promise<ApiResponse<SubmitResponse>> {
        await mockDelay(800);
        return mockSubmitResponse;
      },

      async calculateFD(
        _data: FDCalculatorRequest
      ): Promise<ApiResponse<FDCalculatorResponse>> {
        await mockDelay(400);
        return mockCalculatorResponse;
      },

      async getBranches(
        _params?: BranchesRequest
      ): Promise<ApiResponse<BranchesResponse>> {
        await mockDelay(300);
        return mockBranchesResponse;
      },

      async getSession(
        _accessToken?: string
      ): Promise<ApiResponse<SessionResponse>> {
        await mockDelay(300);
        return mockSessionResponse;
      },

      async getNominee(
        _accessToken: string
      ): Promise<ApiResponse<NomineeResponse>> {
        await mockDelay(300);
        return mockNomineeResponse;
      },

      async getCustomerAccounts(
        _data: CustomerAccountsRequest,
        _accessToken: string
      ): Promise<ApiResponse<CustomerAccount[]>> {
        await mockDelay(300);
        return mockCustomerAccountsResponse;
      },

      async lookupIFSC(
        _ifscCode: string
      ): Promise<ApiResponse<IFSCLookupResponse>> {
        await mockDelay(300);
        return mockIFSCLookupResponse;
      },

      async verifyAccount(
        _data: AccountVerifyRequest
      ): Promise<ApiResponse<AccountVerifyResponse>> {
        await mockDelay(500);
        return mockAccountVerifyResponse;
      },

      async getTranslations(
        _lang: string
      ): Promise<ApiResponse<TranslationsResponse>> {
        await mockDelay(100);
        return mockTranslationsResponse as ApiResponse<TranslationsResponse>;
      },
    };
  }

  // Real implementation
  return {
    async getTerms(): Promise<ApiResponse<TermsResponse>> {
      return fetchWithAuth('/login/terms');
    },

    async authorize(
      data: AuthorizeRequest
    ): Promise<ApiResponse<AuthorizeResponse>> {
      return fetchWithAuth('/login/authorize', { method: 'POST', body: data });
    },

    async exchangeToken(
      data: TokenRequest
    ): Promise<ApiResponse<TokenResponse>> {
      return fetchWithAuth('/login/token', { method: 'POST', body: data });
    },

    async getJourneyConfig(): Promise<ApiResponse<JourneyConfigResponse>> {
      return fetchWithAuth('/journey/config', { method: 'GET' });
    },

    async saveDepositDetails(
      data: DepositRequest,
      accessToken: string
    ): Promise<ApiResponse<SuccessResponse>> {
      return fetchWithAuth('/my/fd/details/deposit', {
        method: 'PUT',
        body: data,
        accessToken,
      });
    },

    async saveBankDetails(
      data: BankRequest,
      accessToken: string
    ): Promise<ApiResponse<SuccessResponse>> {
      return fetchWithAuth('/my/fd/details/bank', {
        method: 'PUT',
        body: data,
        accessToken,
      });
    },

    async submitFD(accessToken: string): Promise<ApiResponse<SubmitResponse>> {
      return fetchWithAuth('/my/fd/submit', {
        method: 'POST',
        body: {},
        accessToken,
      });
    },

    async calculateFD(
      data: FDCalculatorRequest
    ): Promise<ApiResponse<FDCalculatorResponse>> {
      return fetchWithAuth('/my/fd/calculator', { method: 'POST', body: data });
    },

    async getBranches(
      params?: BranchesRequest
    ): Promise<ApiResponse<BranchesResponse>> {
      const searchParams = new URLSearchParams();
      if (params?.country) searchParams.append('country', params.country);
      if (params?.pin) searchParams.append('pin', params.pin);
      if (params?.city) searchParams.append('city', params.city);
      if (params?.district) searchParams.append('district', params.district);
      if (params?.state) searchParams.append('state', params.state);
      const queryString = searchParams.toString();
      const endpoint = `/branches${queryString ? `?${queryString}` : ''}`;
      return fetchWithAuth(endpoint);
    },

    async getSession(
      accessToken?: string
    ): Promise<ApiResponse<SessionResponse>> {
      return fetchWithAuth('/my/fd/session', { method: 'GET', accessToken });
    },

    async getNominee(
      accessToken: string
    ): Promise<ApiResponse<NomineeResponse>> {
      return fetchWithAuth('/my/nominee', { method: 'GET', accessToken });
    },

    async getCustomerAccounts(
      data: CustomerAccountsRequest,
      accessToken: string
    ): Promise<ApiResponse<CustomerAccount[]>> {
      return fetchWithAuth('/individual-customers/info/accounts', {
        method: 'POST',
        body: data,
        accessToken,
      });
    },

    async lookupIFSC(
      ifscCode: string
    ): Promise<ApiResponse<IFSCLookupResponse>> {
      return fetchWithAuth(`/ifsc/${encodeURIComponent(ifscCode)}`);
    },

    async verifyAccount(
      data: AccountVerifyRequest
    ): Promise<ApiResponse<AccountVerifyResponse>> {
      return fetchWithAuth('/account/verify', { method: 'POST', body: data });
    },

    async getTranslations(
      lang: string
    ): Promise<ApiResponse<TranslationsResponse>> {
      return fetchWithAuth(`/translations/${encodeURIComponent(lang)}`);
    },
  };
}

// Default client instance (real mode)
export const apiClient = createApiClient();

// Mock client instance for previews
export const mockApiClient = createApiClient({ mock: true });
