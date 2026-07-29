export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// --- New Auth API Types ---

// GET /login/terms response
export interface Term {
  id: string;
  summary: string;
  documentUrl?: string;  // Optional - external link
  content?: string;       // Optional - inline content
}

export interface TermsResponse {
  terms: Term[];
}

// POST /login/authorize request/response
export type CredentialType = 'mobile_dob' | 'mobile_pan' | 'mobile_dob_pan' | 'debit_card' | 'ucic_password';

export interface AuthorizeCredential {
  type: CredentialType;
  mobile?: string;
  dob?: string;       // Format: YYYY-MM-DD
  pan?: string;
  debitCard?: string;
  ucic?: string;
  password?: string;
}

export interface AuthorizeRequest {
  acceptedTerms: Array<{ id: string }>;
  credential: AuthorizeCredential;
}

export interface AuthorizeResponse {
  sessionId: string;
  hint: string;         // e.g., "OTP has been sent to xxxx3210"
  expiresIn: number;    // seconds
  maxAttempts: number;
  otpLength: number;
}

// POST /login/token request/response
export interface TokenRequest {
  sessionId: string;
  otp: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

// --- OTP Session (internal) ---

export interface OtpSession {
  id: string;
  credential: AuthorizeCredential;
  acceptedTerms: Array<{ id: string }>;
  otpLength: number;
  maxAttempts: number;
  attempts: number;
  expiresAt: Date;
}

// --- Token Storage (internal) ---

export interface StoredToken {
  accessToken: string;
  refreshToken: string;
  credential: AuthorizeCredential;
  expiresAt: Date;
}

// --- Journey Config ---

export interface AggregateSchema {
  key: string;
  label: string;
  fields: Record<string, FieldSchema>;
}

export interface FieldSchema {
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface JourneyConfig {
  journeyType: string;
  requiredAggregates: AggregateSchema[];
  stepTitles: string[];
  components: Record<string, ComponentConfig>;
  layout: LayoutConfig;
  logoUrl?: string;
  interestRatesUrl?: string;
  theme?: {
    colors?: {
      primary?: { default?: string; hover?: string; active?: string };
      secondary?: { default?: string; hover?: string; active?: string };
      surface?: { background?: string; primary?: string; secondary?: string };
      surfaceDark?: { default?: string; hover?: string; active?: string };
    };
  };
}

export interface ComponentConfig {
  id: string;
  type: string;
  props?: Record<string, unknown>;
}

export interface LayoutConfig {
  type: string;
  config?: Record<string, unknown>;
  children?: { componentId: string }[];
}

// --- Deposit & Bank Steps ---

export interface DepositRequest {
  fdType: 'withdrawable' | 'non-withdrawable';
  amount: string;
  interestPayout: 'at-maturity' | 'monthly' | 'quarterly';
  maturityInstructions: string;
  tenureYears: string;
  tenureMonths: string;
  tenureDays: string;
}

export interface OtherBankAccountData {
  accountNumber: string;
  ifsc: string;
  bankName?: string;
  branchName?: string;
  city?: string;
}

// --- IFSC Lookup ---

export interface IFSCLookupResponse {
  bankName: string;
  branchName: string;
  city: string;
}

// --- Account Verification ---

export interface AccountVerifyRequest {
  accountNumber: string;
  ifsc: string;
}

export interface AccountVerifyResponse {
  verified: boolean;
  accountHolderName?: string;
}

export interface BankRequest {
  fundingOption: 'other-bank' | 'primary-bank' | 'combined-funds';
  primaryAmount?: string;
  otherBankAccount?: OtherBankAccountData;
  branch: string;
  addNominee: boolean;
}

export interface SuccessResponse {
  success: true;
}

export interface ErrorResponse {
  success: false;
  errors: ValidationError[];
}

// --- Session Data (for authenticated users) ---

export interface SessionData {
  id: string;
  credential: AuthorizeCredential;
  depositData?: DepositRequest;
  bankData?: BankRequest;
  createdAt: Date;
}

// --- FD Calculator ---

export interface FDCalculatorRequest {
  amount: string;
  tenureYears: string;
  tenureMonths: string;
  tenureDays: string;
  interestPayout: 'at-maturity' | 'monthly' | 'quarterly';
  fdType: 'withdrawable' | 'non-withdrawable';
}

export interface FDCalculatorResponse {
  principal: number;
  interestRate: number;
  interestEarned: number;
  maturityAmount: number;
  maturityDate: string;
  tenureInDays: number;
}

// --- Branch Information ---

export interface BranchesRequest {
  country?: string;
  pin?: string;
  city?: string;
  district?: string;
  state?: string;
}

export interface Branch {
  address: string;
  code: string;
  ifsc: string;
  name: string;
  // Location metadata for filtering (internal use)
  country?: string;
  state?: string;
  city?: string;
  district?: string;
  pin?: string;
}

export interface BranchesResponse {
  branches: Branch[];
}

// --- Nominee ---

export interface NomineeDetails {
  fullName: string;
  dateOfBirth: string;
  relationship: string;
}

export interface NomineeResponse {
  success: true;
  nominee: NomineeDetails | null;
}
