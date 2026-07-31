export interface CustomerInfo {
  customerId: string;
  name: string;
  dob: string;
  pan: string;
  mobile: string;
}

export interface AccountInfo {
  accountId: string;
  accountNo: string;
  currentBalance: string;
}

export interface Branch {
  code: string;
  name: string;
  ifsc: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
}

export interface GuardianInfo {
  name: string;
  relationship: string;
  dob: string;
}

export interface Nominee {
  relationship: string;
  name: string;
  dob: string;
  guardian?: GuardianInfo;
}

export type InterestPaymentOption = 'at_maturity' | 'monthly' | 'quarterly';
export type FundingMethod = 'hdfc' | 'other_bank';

export interface ProductConfig {
  productVariant: string;
  minDeposit: number;
  maxDeposit: number;
  allowedInterestOptions: InterestPaymentOption[];
  allowedMaturityOptions: string[];
  minTenureDays: number;
  maxTenureDays: number;
}

export interface JourneyState {
  step: 1 | 2 | 3 | 4 | 5;

  // Step 1
  bearerToken: string;
  customer: CustomerInfo | null;
  account: AccountInfo | null;

  // Step 2
  fdType: 'withdrawable' | 'non-withdrawable' | '';
  depositAmount: string;
  interestPaymentOption: InterestPaymentOption | '';
  maturityOption: string;
  tenureYears: number | '';
  tenureMonths: number | '';
  tenureDays: number | '';
  roi: number | null;
  maturityAmount: string | null;
  interestEarned: string | null;
  maturityDate: string | null;
  productConfig: ProductConfig | null;

  // Step 3
  fundingMethod: FundingMethod | '';
  branch: Branch | null;
  nominee: Nominee | null;

  // Step 4/5
  applicationId: string | null;
  fdAccountNo: string | null;
}

export type JourneyAction =
  | { type: 'SET_STEP'; payload: 1 | 2 | 3 | 4 | 5 }
  | { type: 'SET_AUTH'; payload: { bearerToken: string; customer: CustomerInfo; account: AccountInfo } }
  | { type: 'SET_PRODUCT_CONFIG'; payload: ProductConfig }
  | { type: 'SET_FD_TYPE'; payload: 'withdrawable' | 'non-withdrawable' }
  | { type: 'SET_DEPOSIT_AMOUNT'; payload: string }
  | { type: 'SET_INTEREST_OPTION'; payload: InterestPaymentOption }
  | { type: 'SET_MATURITY_OPTION'; payload: string }
  | { type: 'SET_TENURE'; payload: { years: number | ''; months: number | ''; days: number | '' } }
  | { type: 'SET_CALCULATION_RESULT'; payload: { roi: number; maturityAmount: string; interestEarned: string; maturityDate: string } }
  | { type: 'SET_FUNDING_METHOD'; payload: FundingMethod }
  | { type: 'SET_BRANCH'; payload: Branch }
  | { type: 'SET_NOMINEE'; payload: Nominee | null }
  | { type: 'SET_APPLICATION_ID'; payload: string }
  | { type: 'SET_FD_ACCOUNT_NO'; payload: string }
  | { type: 'RESET' };
