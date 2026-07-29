/**
 * Stitch API Client
 *
 * A typed client for the Stitch API using Hono RPC.
 * Types are automatically inferred from the API route definitions.
 */

// Client factory and default instance
export { createStitchClient, stitchClient, isTokenExpiringSoon } from './stitch-client.js';

// Mock client for preview environments
export { createMockStitchClient, isBitPreviewEnvironment } from './mock-stitch-client.js';

// Client types
export type { StitchClient, StitchClientConfig } from './stitch-client.js';

/**
 * Branch data returned by the Stitch API /fi/branches endpoint
 */
export type StitchBranch = {
  code: string;
  ifsc: string;
  name: string;
  address: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
};

// React context and hooks
export {
  StitchClientProvider,
  useStitchClient,
  useStitchClientOptional,
  useStitchClientWithFallback,
} from './stitch-client-context.js';

export type { StitchClientProviderProps } from './stitch-client-context.js';

// Re-export types from the API for convenience
export type {
  // Common types
  Money,
  PostalAddress,
  Violation,
  Problem,
  CustomerId,
  Duration,
  ISODate,
  // Auth types
  FindCustomerArgs,
  Claim,
  TokenClaimsResponse,
  // Customer types
  FindCustomerRequest,
  FindCustomerResult,
  ProfileRequest,
  Profile,
  ListAccountsRequest,
  AccountResult,
  AccountResult as CustomerAccount,
  Nominee,
  NomineeGuardian,
  Nomination,
  AccountPermission,
  NominationMethod,
  // FD types
  FDCalculatorRequest,
  FDCalculatorResponse,
  FDInterestPaymentOption,
  FDMaturityOption,
  FDRenewalOption,
  MaturityInstruction,
  AccountRef,
  // Verification types
  VerifyBankAccountRequest,
  BankAccountVerificationResult,
  VerifyUpiVpaRequest,
  UpiVpaVerificationResult,
  VerificationStatus,
  // Forms types
  CustomerApplicationForm,
  SubmitApplicationFormStatus,
  FormStatusRequest,
  FormStatusResponse,
  FormDetailedStatusResponse,
  FormStepStatus,
  FormStatus,
  // Payment types
  PaymentInitiationRequest,
  PaymentInitiationResult,
  PaymentStatusRequest,
  PaymentStatusResult,
  PaymentMethod,
  PaymentTransactionStatus,
  PaymentStatus,
  PaymentLink,
  ExternalBankAccount,
  UPIInstrument,
} from '@api-banking/stitch.stitch-api';
