// API Client Types

export interface ValidationError {
  field: string;
  message: string;
}

export interface Term {
  id: string;
  summary: string;
  documentUrl?: string;
  content?: string;
}

export interface TermsResponse {
  terms: Term[];
}

export interface AuthorizeRequest {
  acceptedTerms: Array<{ id: string }>;
  credential: {
    type: string;
    mobile?: string;
    dob?: string;
    pan?: string;
    debitCard?: string;
    ucic?: string;
    password?: string;
  };
}

export interface AuthorizeResponse {
  sessionId: string;
  hint: string;
  expiresIn: number;
  maxAttempts: number;
  otpLength: number;
}

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

export interface JourneyConfig {
  journeyType: string;
  stepTitles: string[];
  requiredAggregates: Array<{
    key: string;
    label: string;
    fields: Record<string, unknown>;
  }>;
  components: Record<string, {
    id: string;
    type: string;
    props?: Record<string, unknown>;
  }>;
  layout: {
    type: string;
    config?: Record<string, unknown>;
    children?: Array<{ componentId: string }>;
  };
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

export interface JourneyConfigResponse {
  journeyConfig: JourneyConfig;
}

export interface DepositRequest {
  fdType: 'withdrawable' | 'non-withdrawable';
  amount: string;
  interestPayout: 'at-maturity' | 'monthly' | 'quarterly';
  maturityInstructions: string;
  tenureYears: string;
  tenureMonths: string;
  tenureDays: string;
}

export interface BankRequest {
  fundingOption: 'other-bank' | 'primary-bank' | 'combined-funds';
  primaryAmount?: string;
  otherBankAccount?: string;
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

export interface FDCalculatorRequest {
  amount: string;
  tenureYears: string;
  tenureMonths: string;
  tenureDays: string;
  interestPayout: 'at-maturity' | 'monthly' | 'quarterly';
  fdType: 'withdrawable' | 'non-withdrawable';
}

export interface Money {
  amount: number;
  currency: string;
}

export interface FDCalculatorResponse {
  maturityAmount?: Money;
  roi?: number;
  startDate?: string;
  maturityDate?: string;
  interestEarned?: Money;
}

export interface IFSCLookupResponse {
  success: true;
  bankName: string;
  branchName: string;
  city: string;
}

export interface AccountVerifyRequest {
  accountNumber: string;
  ifsc: string;
}

export interface AccountVerifyResponse {
  status: 'verified' | 'unverified' | 'not-verified';
  reason?: string;
}

export interface CustomerAccountsRequest {
  customerId: string;
  permission?: 'debit';
  currency?: string;
}

export interface Address {
  lines: string[];
  city: string;
  state: string;
  pin: string;
  country: string;
}

export interface NomineeInfo {
  order: number;
  name: string;
  sharePct: string;
  dob: string;
  mobile: string;
  relationship: string;
  address: Address;
}

export interface AccountNomination {
  method: string;
  nominees: NomineeInfo[];
}

export interface CustomerAccount {
  accountId: string;
  accountNo: string;
  currentBalance: Money;
  drawingLimit: Money;
  nomination?: AccountNomination;
}

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
}

export interface BranchesResponse {
  branches: Branch[];
}

export interface SubmitResponse {
  success: true;
  applicationId: string;
}

export interface SessionResponse {
  success: true;
  session: {
    depositData: DepositRequest | null;
    bankData: BankRequest | null;
    currentStep: number;
    createdAt: string;
  };
}

export interface NomineeDetails {
  fullName: string;
  dateOfBirth: string;
  relationship: string;
}

export interface NomineeResponse {
  success: true;
  nominee: NomineeDetails | null;
}

export type ApiResponse<T> = T | ErrorResponse;

export interface ApiClientConfig {
  baseUrl?: string;
  clientId?: string;
  mock?: boolean;
}

export type TranslationsResponse = Record<string, unknown>;

export interface ApiClient {
  // Auth endpoints (no token required)
  getTerms(): Promise<ApiResponse<TermsResponse>>;
  authorize(data: AuthorizeRequest): Promise<ApiResponse<AuthorizeResponse>>;
  exchangeToken(data: TokenRequest): Promise<ApiResponse<TokenResponse>>;

  // Protected endpoints (token required)
  saveDepositDetails(data: DepositRequest, accessToken: string): Promise<ApiResponse<SuccessResponse>>;
  saveBankDetails(data: BankRequest, accessToken: string): Promise<ApiResponse<SuccessResponse>>;
  submitFD(accessToken: string): Promise<ApiResponse<SubmitResponse>>;
  getSession(accessToken?: string): Promise<ApiResponse<SessionResponse>>;
  getNominee(accessToken: string): Promise<ApiResponse<NomineeResponse>>;
  getCustomerAccounts(
    data: CustomerAccountsRequest,
    accessToken: string
  ): Promise<ApiResponse<CustomerAccount[]>>;

  // Public endpoints
  getJourneyConfig(): Promise<ApiResponse<JourneyConfigResponse>>;
  calculateFD(data: FDCalculatorRequest): Promise<ApiResponse<FDCalculatorResponse>>;
  getBranches(params?: BranchesRequest): Promise<ApiResponse<BranchesResponse>>;
  lookupIFSC(ifscCode: string): Promise<ApiResponse<IFSCLookupResponse>>;
  verifyAccount(data: AccountVerifyRequest): Promise<ApiResponse<AccountVerifyResponse>>;
  getTranslations(lang: string): Promise<ApiResponse<TranslationsResponse>>;
}
