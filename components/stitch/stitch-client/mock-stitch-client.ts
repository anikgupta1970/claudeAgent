/**
 * Mock Stitch Client for Bit Preview Environments
 *
 * Returns hardcoded mock data instead of making HTTP calls.
 * Used automatically in Bit component previews where the real API is unavailable.
 */

import type { StitchClient } from './stitch-client.js';

/**
 * Check if the current environment is a Bit preview domain
 */
export function isBitPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname.endsWith('.bit-app.dev') || hostname.endsWith('.composed.app');
}

/**
 * Creates a mock Stitch client that returns realistic hardcoded data.
 * Has the same shape as createStitchClient() but never makes network calls.
 */
export function createMockStitchClient(): StitchClient {
  return {
    raw: null as any,
    setTokenProvider() { /* no-op for mock */ },

    // Auth
    getTokenClaims: async () => ({
      claims: [
        { type: 'mobile', value: '9876543210' },
        { type: 'dob', value: '1990-01-15' },
      ],
    }),

    // Customer
    findCustomer: async () => ({
      customerId: 'CUST001',
      name: 'Rahul Sharma',
      mobile: '9876543210',
    }),

    findCustomerWithToken: async () => ({
      customerId: 'CUST001',
      name: 'Rahul Sharma',
      mobile: '9876543210',
    }),

    getProfile: async () => ({
      name: 'Rahul Sharma',
      mobile: '9876543210',
      email: 'rahul.sharma@example.com',
      dob: '1990-01-15',
      pan: 'ABCDE1234F',
    }),

    getAccounts: async () => ({
      accounts: [
        {
          accountId: 'ACC001',
          accountNo: '1234567890',
          type: 'savings',
          balance: { amount: 500000, currency: 'INR' },
          ifsc: 'SBIN0001234',
          branch: 'Indiranagar Branch',
          status: 'active',
        },
        {
          accountId: 'ACC002',
          accountNo: '9876543210',
          type: 'current',
          balance: { amount: 250000, currency: 'INR' },
          ifsc: 'SBIN0005678',
          branch: 'Koramangala Branch',
          status: 'active',
        },
      ],
    }),

    getCustomerAccounts: async () => ({
      accounts: [
        {
          accountId: 'ACC001',
          accountNo: '1234567890',
          type: 'savings',
          balance: { amount: 500000, currency: 'INR' },
          ifsc: 'SBIN0001234',
          branch: 'Indiranagar Branch',
          status: 'active',
          nomination: {
            method: 'successive',
            nominees: [
              {
                order: 1,
                name: 'Saavan Sharma',
                sharePct: 100,
                dob: '2015-06-10',
                mobile: '+919876543210',
                relationship: 'SON',
                address: { lines: ['123 Main Street'], city: 'MUMBAI', state: 'IN-MH', pin: '400001', country: 'IN' },
                guardian: {
                  name: 'Rahul Sharma',
                  dob: '1990-01-15',
                  address: { lines: ['123 Main Street'], city: 'MUMBAI', state: 'IN-MH', pin: '400001', country: 'IN' },
                },
              },
            ],
          },
        },
        {
          accountId: 'ACC002',
          accountNo: '9876543210',
          type: 'current',
          balance: { amount: 250000, currency: 'INR' },
          ifsc: 'SBIN0005678',
          branch: 'Koramangala Branch',
          status: 'active',
        },
      ],
    }),

    // FD Calculator
    calculateFD: async () => ({
      maturityAmount: { amount: 107100, currency: 'INR' },
      interestAmount: { amount: 7100, currency: 'INR' },
      rateOfInterest: 7.1,
      effectiveDate: '2026-03-10',
      maturityDate: '2027-03-10',
    }),

    calculateFDLegacy: async () => ({
      maturityAmount: { amount: 107100, currency: 'INR' },
      interestAmount: { amount: 7100, currency: 'INR' },
      rateOfInterest: 7.1,
      effectiveDate: '2026-03-10',
      maturityDate: '2027-03-10',
    }),

    // Verifications
    verifyBankAccount: async () => ({
      status: 'verified' as const,
      accountNo: '1234567890',
      ifsc: 'SBIN0001234',
      customerName: 'Rahul Sharma',
    }),

    verifyUpiVpa: async () => ({
      status: 'verified',
      vpa: 'rahul@upi',
      name: 'Rahul Sharma',
    }),

    // Forms
    submitForm: async () => ({
      applicationId: 'APP-MOCK-001',
      status: 'submitted',
    }),

    getFormStatus: async () => ({
      applicationId: 'APP-MOCK-001',
      status: 'approved',
    }),

    getFormDetailedStatus: async () => ({
      applicationId: 'APP-MOCK-001',
      status: 'approved',
      steps: [
        { name: 'kyc', status: 'completed' },
        { name: 'deposit', status: 'completed' },
        { name: 'payment', status: 'completed' },
      ],
    }),

    // Payments
    initiatePayment: async () => ({
      paymentLink: {
        url: 'https://example.com/mock-payment',
        method: 'redirect',
      },
    }),

    getPaymentStatus: async () => ({
      status: 'success',
      paymentTxnId: 'TXN-MOCK-001',
      amount: { amount: 100000, currency: 'INR' },
    }),

    // Login
    getLoginTerms: async () => ({
      terms: [
        { id: 'terms-1', title: 'Terms & Conditions', url: 'https://example.com/terms', version: '1.0' },
        { id: 'terms-2', title: 'Privacy Policy', url: 'https://example.com/privacy', version: '1.0' },
      ],
    }),

    authorize: async () => ({
      sessionId: 'SESSION-MOCK-001',
      expiresIn: 300,
    }),

    exchangeToken: async () => ({
      accessToken: 'mock-access-token-xyz',
      refreshToken: 'mock-refresh-token-xyz',
      tokenType: 'Bearer',
      expiresIn: 3600,
    }),

    refreshAccessToken: async () => ({
      accessToken: 'mock-access-token-refreshed',
      refreshToken: 'mock-refresh-token-refreshed',
      tokenType: 'Bearer',
      expiresIn: 3600,
    }),

    // Processing
    generateStitchToken: async () => ({
      token: 'mock-stitch-token-xyz',
      expiresIn: 3600,
    }),

    // Products
    getProducts: async () => ({
      products: [
        { id: 'fd-regular', name: 'Regular FD', category: 'fd', minAmount: 10000, maxAmount: 10000000 },
        { id: 'sa-basic', name: 'Basic Savings', category: 'sa', minAmount: 1000 },
      ],
    }),

    getFDProducts: async () => ({
      products: [
        { id: 'fd-regular', name: 'Regular FD', variant: 'regular', minAmount: 10000, maxAmount: 10000000, minTenure: 'P7D', maxTenure: 'P10Y' },
        { id: 'fd-senior', name: 'Senior Citizen FD', variant: 'senior', minAmount: 10000, maxAmount: 10000000, minTenure: 'P7D', maxTenure: 'P10Y' },
      ],
    }),

    getSAProducts: async () => ({
      products: [
        { id: 'sa-basic', name: 'Basic Savings Account', variant: 'basic', minBalance: 1000 },
      ],
    }),

    // Locations
    getStates: async () => ({
      states: [
        { code: 'KA', name: 'Karnataka' },
        { code: 'MH', name: 'Maharashtra' },
        { code: 'DL', name: 'Delhi' },
        { code: 'TN', name: 'Tamil Nadu' },
      ],
    }),

    getDistricts: async () => ({
      districts: [
        { code: 'BLR', name: 'Bangalore Urban' },
        { code: 'BLR-R', name: 'Bangalore Rural' },
        { code: 'MYS', name: 'Mysore' },
      ],
    }),

    getCities: async () => ({
      cities: [
        { code: 'BLR', name: 'Bengaluru' },
        { code: 'MYS', name: 'Mysuru' },
        { code: 'HUB', name: 'Hubballi' },
      ],
    }),

    // Branches
    getBranches: async () => ({
      branches: [
        { code: 'BR001', ifsc: 'SBIN0001234', name: 'Indiranagar Branch', address: '100 Feet Road, Indiranagar, Bengaluru', postalCode: '560038', city: 'Bengaluru', state: 'Karnataka', country: 'IN' },
        { code: 'BR002', ifsc: 'SBIN0005678', name: 'Koramangala Branch', address: '80 Feet Road, Koramangala, Bengaluru', postalCode: '560034', city: 'Bengaluru', state: 'Karnataka', country: 'IN' },
      ],
    }),

    getBranchesByPincode: async () => ({
      branches: [
        { code: 'BR001', ifsc: 'SBIN0001234', name: 'Indiranagar Branch', address: '100 Feet Road, Indiranagar, Bengaluru', postalCode: '560038', city: 'Bengaluru', state: 'Karnataka', country: 'IN' },
      ],
    }),

    getBranchesByLocation: async () => ({
      branches: [
        { code: 'BR001', ifsc: 'SBIN0001234', name: 'Indiranagar Branch', address: '100 Feet Road, Indiranagar, Bengaluru', postalCode: '560038', city: 'Bengaluru', state: 'Karnataka', country: 'IN' },
        { code: 'BR002', ifsc: 'SBIN0005678', name: 'Koramangala Branch', address: '80 Feet Road, Koramangala, Bengaluru', postalCode: '560034', city: 'Bengaluru', state: 'Karnataka', country: 'IN' },
      ],
    }),

    getBranchStates: async () => ({
      states: ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu'],
    }),

    getBranchCities: async () => ({
      cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
    }),

    // Journey
    getJourneyConfig: async (_tenant?: string) => ({
      journeyId: 'fd-journey-mock',
      steps: [
        { key: 'deposit-details', type: 'deposit-details', title: 'Deposit Details', order: 1 },
        { key: 'bank-details', type: 'bank-details', title: 'Bank Details', order: 2 },
        { key: 'nominee', type: 'nominee', title: 'Nominee', order: 3 },
      ],
    }),

    // FD details
    saveDepositDetails: async () => ({ success: true }),
    saveBankDetails: async () => ({ success: true }),
    submitFD: async () => ({ success: true, applicationId: 'APP-MOCK-001' }),

    // Session
    getSession: async () => ({}),

    // IFSC
    lookupIFSC: async () => ({
      ifsc: 'SBIN0001234',
      bank: 'State Bank of India',
      branch: 'Indiranagar Branch',
      address: '100 Feet Road, Indiranagar, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
    }),

    // Translations
    getTranslations: async () => ({
      locale: 'en',
      messages: {},
    }),

    // Account verification
    verifyAccount: async () => ({
      status: 'verified',
      accountNumber: '1234567890',
      ifsc: 'SBIN0001234',
      name: 'Rahul Sharma',
    }),
  } as unknown as StitchClient;
}
