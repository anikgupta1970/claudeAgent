import type { ISODate } from './common.js';

/**
 * Find customer with mobile and DOB
 */
export interface FindCustomerWithMobileAndDob {
  mobile: string; // E.164 format
  dob: ISODate;
}

/**
 * Find customer with mobile and PAN
 */
export interface FindCustomerWithMobileAndPan {
  mobile: string; // E.164 format
  pan: string; // 10 chars, pattern: [A-Z]{5}[0-9]{4}[A-Z]
}

/**
 * Find customer arguments - one of mobile+dob or mobile+pan
 * Based on OpenAPI spec: components/schemas/FindCustomerArgs
 */
export type FindCustomerArgs = FindCustomerWithMobileAndDob | FindCustomerWithMobileAndPan;

/**
 * Token claim
 * Based on OpenAPI spec: components/schemas/Claim
 */
export interface Claim {
  name?: string;
  value?: string;
}

/**
 * Token claims response
 * Based on OpenAPI spec: components/schemas/TokenResponse
 */
export interface TokenClaimsResponse {
  claims?: Claim[];
}
