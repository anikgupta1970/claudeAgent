// Mock responses for preview/composition mode

import { en as mockTranslationsResponse } from '@api-banking/fixed-deposit.language-packs';

import type {
  TermsResponse,
  AuthorizeResponse,
  TokenResponse,
  JourneyConfigResponse,
  SuccessResponse,
  FDCalculatorResponse,
  SubmitResponse,
  BranchesResponse,
  SessionResponse,
  IFSCLookupResponse,
  AccountVerifyResponse,
  CustomerAccount,
  NomineeResponse,
} from './types.js';

export const mockTermsResponse: TermsResponse = {
  terms: [
    {
      id: '1',
      summary: 'I/we have read, understood, and hereby accept the Privacy Policy.',
      documentUrl: 'https://example.com/privacy-policy',
    },
    {
      id: '2',
      summary: 'I/we hereby give consent (V.1.0) in relation to Requested Products and Services.',
      content: 'By accepting this consent, you agree to the terms and conditions for the Fixed Deposit services. This includes authorization for the bank to process your application and manage your deposit account.',
    },
  ],
};

export const mockAuthorizeResponse: AuthorizeResponse = {
  sessionId: 'mock-session-12345',
  hint: 'OTP sent to xxxxxx3210',
  expiresIn: 60,
  maxAttempts: 3,
  otpLength: 6,
};

export const mockTokenResponse: TokenResponse = {
  accessToken: 'mock-access-token-xyz789',
  refreshToken: 'mock-refresh-token-abc123',
  tokenType: 'Bearer',
  expiresIn: 3600,
};

export const mockJourneyConfigResponse: JourneyConfigResponse = {
  journeyConfig: {
    journeyType: 'customer-fd',
    logoUrl: 'https://placeholder.co/120x40?text=BankLogo',
    interestRatesUrl: 'https://example.com/interest-rates',
    // Preview and Submit FD are hardcoded in the app, not from API
    stepTitles: ['Deposit Details', 'Bank Details'],
    requiredAggregates: [
      {
        key: 'depositDetails',
        label: 'Deposit Details',
        fields: {},
      },
      {
        key: 'bankDetails',
        label: 'Bank Details',
        fields: {},
      },
    ],
    components: {
      'deposit-details': {
        id: 'deposit-details',
        type: 'DepositDetails',
        props: {
          allowedFdTypes: ['withdrawable', 'non-withdrawable'],
        },
      },
      'bank-details': {
        id: 'bank-details',
        type: 'BankDetails',
        props: {
          fdAmount: 100000,
          primaryAccount: {
            accountNumber: '****1234',
            accountType: 'SAVINGS ACCOUNT',
            availableBalance: 500000,
          },
        },
      },
      // preview-step and submit-step are hardcoded in the app
    },
    layout: {
      type: 'stepper',
      config: {
        stepTitles: ['Deposit Details', 'Bank Details'],
      },
      children: [
        { componentId: 'deposit-details' },
        { componentId: 'bank-details' },
        // preview-step and submit-step are hardcoded in the app
      ],
    },
  },
};

export const mockSuccessResponse: SuccessResponse = {
  success: true,
};

export const mockCalculatorResponse: FDCalculatorResponse = {
  maturityAmount: { amount: 107100, currency: 'INR' },
  roi: 7.1,
  interestEarned: { amount: 7100, currency: 'INR' },
  maturityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  startDate: new Date().toISOString().split('T')[0],
};

export const mockSubmitResponse: SubmitResponse = {
  success: true,
  applicationId: `FD${Date.now().toString().slice(-8)}`,
};

export const mockBranchesResponse: BranchesResponse = {
  branches: [
    {
      address: '209 - 214, Kailash Building, 26, Kasturba Gandhi Marg, New Delhi, Delhi',
      code: '3',
      ifsc: 'HDFC0000003',
      name: 'K G Marg',
    },
    {
      address: 'Ground Floor, Connaught Place, New Delhi, Delhi',
      code: '4',
      ifsc: 'HDFC0000004',
      name: 'Connaught Place',
    },
    {
      address: 'Shop No. 5, Ground Floor, Andheri West, Mumbai, Maharashtra',
      code: '101',
      ifsc: 'HDFC0000101',
      name: 'Andheri West',
    },
    {
      address: '1st Floor, Phoenix Mall, Lower Parel, Mumbai, Maharashtra',
      code: '102',
      ifsc: 'HDFC0000102',
      name: 'Lower Parel',
    },
    {
      address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra',
      code: '103',
      ifsc: 'HDFC0000103',
      name: 'BKC',
    },
    {
      address: 'Nariman Point, Mumbai, Maharashtra',
      code: '104',
      ifsc: 'HDFC0000104',
      name: 'Nariman Point',
    },
    {
      address: 'MG Road, Bangalore, Karnataka',
      code: '201',
      ifsc: 'HDFC0000201',
      name: 'MG Road',
    },
    {
      address: 'Koramangala 5th Block, Bangalore, Karnataka',
      code: '202',
      ifsc: 'HDFC0000202',
      name: 'Koramangala',
    },
  ],
};

export const mockIFSCLookupResponse: IFSCLookupResponse = {
  success: true,
  bankName: 'State Bank of India',
  branchName: 'MUMBAI MAIN',
  city: 'Mumbai, Maharashtra',
};

export const mockAccountVerifyResponse: AccountVerifyResponse = {
  status: 'verified',
};

export const mockCustomerAccountsResponse: CustomerAccount[] = [
  {
    accountId: '123456',
    accountNo: '12345678901234',
    currentBalance: { amount: 5000, currency: 'INR' },
    drawingLimit: { amount: 5000, currency: 'INR' },
    nomination: {
      method: 'successive',
      nominees: [],
    },
  },
  {
    accountId: '789012',
    accountNo: '12345678901235',
    currentBalance: { amount: 10000, currency: 'INR' },
    drawingLimit: { amount: 10000, currency: 'INR' },
    nomination: {
      method: 'successive',
      nominees: [],
    },
  },
];

export const mockNomineeResponse: NomineeResponse = {
  success: true,
  nominee: {
    fullName: 'Priya Sharma',
    dateOfBirth: '15/03/1990',
    relationship: 'Spouse',
  },
};

// Mock session response - simulates an empty session (no saved data yet)
export { mockTranslationsResponse };

export const mockSessionResponse: SessionResponse = {
  success: true,
  session: {
    depositData: null,
    bankData: null,
    currentStep: 1, // Deposit Details step (after login)
    createdAt: new Date().toISOString(),
  },
};
