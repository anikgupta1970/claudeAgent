import type { Money, CustomerId, PostalAddress, ISODate } from './common.js';

/**
 * Account permission type
 * Based on OpenAPI spec: components/schemas/AccountPermission
 */
export type AccountPermission = 'debit';

/**
 * Nomination method
 * Based on OpenAPI spec: components/schemas/NominationMethod
 */
export type NominationMethod = 'successive' | 'simultaneous';

/**
 * Nominee information
 * Based on OpenAPI spec: components/schemas/Nominee
 */
export interface Nominee {
  order: number;
  name: string;
  sharePct?: number;
  dob?: ISODate;
  mobile?: string;
  relationship?: string;
  address: PostalAddress;
  guardian?: NomineeGuardian;
}

/**
 * Nominee guardian information
 */
export interface NomineeGuardian {
  name: string;
  dob: ISODate;
  address: PostalAddress;
  relationWithNominee?: string;
  mobile?: string;
  email?: string;
}

/**
 * Account nomination details
 * Based on OpenAPI spec: components/schemas/Nomination
 */
export interface Nomination {
  method: NominationMethod;
  nominees: Nominee[];
}

/**
 * List accounts request
 * Based on OpenAPI spec: components/schemas/ListAccountsArgs
 */
export interface ListAccountsRequest {
  customerId: CustomerId;
  permission: AccountPermission;
  currency: string; // ISO 4217 alpha-3
}

/**
 * Account information result
 * Based on OpenAPI spec: components/schemas/GetAccountsResult
 */
export interface AccountResult {
  accountId: string;
  accountNo: string; // Partially masked (e.g., "****1234")
  currentBalance: Money;
  drawingLimit: Money;
  nomination?: Nomination;
}

/**
 * Profile request
 * Based on OpenAPI spec: components/schemas/ProfileArgs
 */
export interface ProfileRequest {
  customerId: CustomerId;
}

/**
 * Customer profile
 * Based on OpenAPI spec: components/schemas/Profile
 */
export interface Profile {
  fullName: string;
  mobile: string;
  dob: ISODate;
  pan?: string;
  email?: string;
}

/**
 * Customer search request
 * Based on OpenAPI spec: /individual-customers/find
 */
export interface FindCustomerRequest {
  mobile?: string;
  pan?: string;
  dob?: ISODate;
}

/**
 * Customer search result
 */
export interface FindCustomerResult {
  customerId: CustomerId;
  name: string;
  mobile: string;
}
