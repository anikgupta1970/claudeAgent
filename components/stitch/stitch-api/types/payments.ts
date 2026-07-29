import type { Money, CustomerId } from './common.js';

/**
 * Payment method types
 * Based on OpenAPI spec: components/schemas/PaymentMethod
 */
export type PaymentMethod = 'cash' | 'cheque' | 'upi' | 'transfer' | 'net_banking';

/**
 * Payment transaction status
 * Based on OpenAPI spec: components/schemas/PaymentTransactionStatus
 */
export type PaymentTransactionStatus = 'success' | 'pending' | 'failed';

/**
 * Payment status (for application)
 * Based on OpenAPI spec: components/schemas/PaymentStatus
 */
export type PaymentStatus = 'deposited' | 'unpaid' | 'paid' | 'initiated';

/**
 * External bank account instrument
 */
export interface ExternalBankAccount {
  accountNo: string;
  ifsc: string;
  customerName: string;
}

/**
 * UPI instrument
 */
export interface UPIInstrument {
  accountNo: string;
  customerName: string;
  vpa: string;
}

/**
 * Payment initiation request
 * Based on OpenAPI spec: components/schemas/PaymentInitiationArgs
 */
export interface PaymentInitiationRequest {
  customerId: CustomerId;
  clientReferenceNumber: string;
  clientSuccessUrl: string;
  clientFailureUrl: string;
  method: PaymentMethod;
  instrument?: ExternalBankAccount | UPIInstrument;
  amount: Money;
}

/**
 * Payment link details
 */
export interface PaymentLink {
  url?: string;
  method?: string;
  parameters?: Record<string, string>;
}

/**
 * Payment initiation result
 * Based on OpenAPI spec: components/schemas/PaymentInitiationResult
 */
export interface PaymentInitiationResult {
  paymentTxnId?: string;
  paymentLink?: PaymentLink;
}

/**
 * Payment status request
 * Based on OpenAPI spec: components/schemas/PaymentStatusArgs
 */
export interface PaymentStatusRequest {
  clientReferenceNumber?: string | null;
  paymentTxnId?: string | null;
}

/**
 * Payment status result
 * Based on OpenAPI spec: components/schemas/PaymentStatusResult
 */
export interface PaymentStatusResult {
  paymentTxnId?: string;
  status?: PaymentTransactionStatus;
  clientReferenceNumber?: string;
}
