import type { Money, CustomerId, Duration, ISODate } from './common.js';

/**
 * FD Interest Payment Options
 * Based on OpenAPI spec: components/schemas/FDInterestPaymentOption
 */
export type FDInterestPaymentOption = 'at_maturity' | 'monthly' | 'quarterly';

/**
 * FD Maturity Options
 * Based on OpenAPI spec: components/schemas/FDMaturityOption
 */
export type FDMaturityOption = 'close' | 'renew' | 'transfer';

/**
 * FD Renewal Options
 * Based on OpenAPI spec: components/schemas/FDRenewalOption
 */
export type FDRenewalOption = 'full' | 'principal';

/**
 * Account reference for maturity payout
 */
export interface AccountRef {
  accountId: string;
}

/**
 * Maturity instruction for FD
 * Based on OpenAPI spec: components/schemas/MaturityInstruction
 */
export interface MaturityInstruction {
  option: FDMaturityOption;
  renewalOption?: FDRenewalOption;
  payoutAccountId?: string; // Deprecated
  payoutAccount?: AccountRef;
  managersCheque?: boolean;
}

/**
 * FD Calculator request body
 * Based on OpenAPI spec: components/schemas/CalculationArgs
 */
export interface FDCalculatorRequest {
  customerId: CustomerId;
  productVariant: string;
  depositAmount: Money;
  tenure: Duration;
  interestPaymentOption: FDInterestPaymentOption;
  maturityInstruction: MaturityInstruction;
}

/**
 * FD Calculator response
 * Based on OpenAPI spec: components/schemas/MaturityCalculationResult
 */
export interface FDCalculatorResponse {
  maturityAmount?: Money;
  roi?: number;
  startDate?: ISODate;
  maturityDate?: ISODate;
  interestEarned?: Money;
}
