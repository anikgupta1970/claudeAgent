import type { CustomerId } from './common.js';

/**
 * Verification status
 * Based on OpenAPI spec: components/schemas/VerificationStatus
 */
export type VerificationStatus = 'success' | 'failed';

/**
 * Bank account verification request
 * Based on OpenAPI spec: components/schemas/VerifyBankAccountArgs
 */
export interface VerifyBankAccountRequest {
  customerId: CustomerId;
  accountNo: string;
  ifsc: string; // 11 characters, pattern: ^[A-Z]{4}0[A-Z0-9]{6}$
}

/**
 * Bank account verification result
 * Based on OpenAPI spec: components/schemas/BankAccountVerificationResult
 */
export interface BankAccountVerificationResult {
  status: VerificationStatus;
  reason?: string;
}

/**
 * UPI VPA verification request
 * Based on OpenAPI spec: components/schemas/VerifyUpiVpaArgs
 */
export interface VerifyUpiVpaRequest {
  customerId: CustomerId;
  vpa: string; // Virtual payment address (e.g., "xyz@paytm")
}

/**
 * UPI VPA verification result
 * Based on OpenAPI spec: components/schemas/UpiVpaVerificationResult
 */
export interface UpiVpaVerificationResult {
  status: VerificationStatus;
  reason?: string;
}
