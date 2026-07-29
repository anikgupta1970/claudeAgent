import { randomUUID } from 'crypto';
import type {
  ValidationResult,
  ValidationError,
  AuthorizeRequest,
  AuthorizeCredential,
  DepositRequest,
  BankRequest,
  OtpSession,
  StoredToken,
  SessionData,
  JourneyConfig,
  Term,
  FDCalculatorRequest,
  FDCalculatorResponse,
  BranchesRequest,
  Branch,
  IFSCLookupResponse,
  AccountVerifyResponse,
  NomineeResponse,
} from './types.js';

const OTP_SESSION_EXPIRY_MS = 60 * 1000; // 60 seconds
const ACCESS_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Default terms for testing
const DEFAULT_TERMS: Term[] = [
  {
    id: '1',
    summary:
      'I/we have read, understood, and hereby accept the Privacy Policy.',
    documentUrl: 'https://example.com/privacy-policy',
  },
  {
    id: '2',
    summary:
      'I/we hereby give consent (V.1.0) in relation to Requested Products',
    content:
      'This is the content of the consent, can be a long text. By accepting this consent, you agree to allow the bank to process your application for the requested products and services. This includes sharing your information with authorized third parties for verification purposes.',
  },
];

// Default branches for testing with location metadata
const DEFAULT_BRANCHES: Branch[] = [
  // New Delhi branches
  {
    address:
      '209 - 214, Kailash Building, 26, Kasturba Gandhi Marg, New Delhi, Delhi',
    code: '3',
    ifsc: 'HDFC0000003',
    name: 'K G Marg',
    country: 'IN',
    state: 'IN-DL',
    city: 'Delhi',
    district: 'New Delhi',
    pin: '110001',
  },
  {
    address: 'Ground Floor, Connaught Place, New Delhi, Delhi',
    code: '4',
    ifsc: 'HDFC0000004',
    name: 'Connaught Place',
    country: 'IN',
    state: 'IN-DL',
    city: 'Delhi',
    district: 'New Delhi',
    pin: '110001',
  },
  // Mumbai branches
  {
    address: 'Shop No. 5, Ground Floor, Andheri West, Mumbai, Maharashtra',
    code: '101',
    ifsc: 'HDFC0000101',
    name: 'Andheri West',
    country: 'IN',
    state: 'IN-MH',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    pin: '400058',
  },
  {
    address: '1st Floor, Phoenix Mall, Lower Parel, Mumbai, Maharashtra',
    code: '102',
    ifsc: 'HDFC0000102',
    name: 'Lower Parel',
    country: 'IN',
    state: 'IN-MH',
    city: 'Mumbai',
    district: 'Mumbai',
    pin: '400013',
  },
  {
    address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra',
    code: '103',
    ifsc: 'HDFC0000103',
    name: 'BKC',
    country: 'IN',
    state: 'IN-MH',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    pin: '400051',
  },
  {
    address: 'Nariman Point, Mumbai, Maharashtra',
    code: '104',
    ifsc: 'HDFC0000104',
    name: 'Nariman Point',
    country: 'IN',
    state: 'IN-MH',
    city: 'Mumbai',
    district: 'Mumbai',
    pin: '400021',
  },
  // Bangalore branches
  {
    address: 'MG Road, Bangalore, Karnataka',
    code: '201',
    ifsc: 'HDFC0000201',
    name: 'MG Road',
    country: 'IN',
    state: 'IN-KA',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    pin: '560001',
  },
  {
    address: 'Koramangala 5th Block, Bangalore, Karnataka',
    code: '202',
    ifsc: 'HDFC0000202',
    name: 'Koramangala',
    country: 'IN',
    state: 'IN-KA',
    city: 'Bangalore',
    district: 'Bangalore Urban',
    pin: '560095',
  },
];

export class MockServer {
  private otpSessions: Map<string, OtpSession> = new Map();

  private accessTokens: Map<string, StoredToken> = new Map();

  private sessions: Map<string, SessionData> = new Map();

  async getHello() {
    return 'Hello World!';
  }

  // GET /login/terms
  getTerms(_clientId?: string): Term[] {
    // In production, this could return different terms based on clientId
    return DEFAULT_TERMS;
  }

  // POST /login/authorize - validate credentials and accepted terms
  validateAuthorize(data: AuthorizeRequest): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate accepted terms
    if (!data.acceptedTerms || data.acceptedTerms.length === 0) {
      errors.push({
        field: 'acceptedTerms',
        message: 'You must accept the terms to continue',
      });
    } else {
      // Check that all required terms are accepted
      const requiredTermIds = DEFAULT_TERMS.map((t) => t.id);
      const acceptedIds = data.acceptedTerms.map((t) => t.id);
      const missingTerms = requiredTermIds.filter(
        (id) => !acceptedIds.includes(id)
      );
      if (missingTerms.length > 0) {
        errors.push({
          field: 'acceptedTerms',
          message: 'You must accept all terms to continue',
        });
      }
    }

    // Validate credential
    if (!data.credential) {
      errors.push({ field: 'credential', message: 'Credentials are required' });
      return { valid: false, errors };
    }

    const { credential } = data;
    const mode = credential.type;

    // Validate based on credential type
    if (
      mode === 'mobile_dob' ||
      mode === 'mobile_pan' ||
      mode === 'mobile_dob_pan'
    ) {
      if (!credential.mobile || !/^\d{10}$/.test(credential.mobile)) {
        errors.push({
          field: 'mobile',
          message: 'Mobile number must be exactly 10 digits',
        });
      }
    }

    if (mode === 'mobile_dob') {
      if (!credential.dob) {
        errors.push({ field: 'dob', message: 'Date of birth is required' });
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(credential.dob)) {
        errors.push({
          field: 'dob',
          message: 'Date of birth must be in YYYY-MM-DD format',
        });
      }
    }

    if (mode === 'mobile_pan') {
      if (!credential.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(credential.pan)) {
        errors.push({
          field: 'pan',
          message: 'PAN must be in format XXXXX0000X',
        });
      }
    }

    if (mode === 'mobile_dob_pan') {
      const hasDob =
        credential.dob && /^\d{4}-\d{2}-\d{2}$/.test(credential.dob);
      const hasPan =
        credential.pan && /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(credential.pan);
      if (!hasDob && !hasPan) {
        errors.push({
          field: 'general',
          message: 'Either a valid date of birth or PAN is required',
        });
      }
      if (credential.dob && !/^\d{4}-\d{2}-\d{2}$/.test(credential.dob)) {
        errors.push({
          field: 'dob',
          message: 'Date of birth must be in YYYY-MM-DD format',
        });
      }
      if (credential.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(credential.pan)) {
        errors.push({
          field: 'pan',
          message: 'PAN must be in format XXXXX0000X',
        });
      }
    }

    if (mode === 'debit_card') {
      if (!credential.debitCard || !/^\d{16}$/.test(credential.debitCard)) {
        errors.push({
          field: 'debitCard',
          message: 'Debit card number must be exactly 16 digits',
        });
      }
    }

    if (mode === 'ucic_password') {
      if (!credential.ucic || !/^\d{8,12}$/.test(credential.ucic)) {
        errors.push({ field: 'ucic', message: 'UCIC must be 8-12 digits' });
      }
      if (
        !credential.password ||
        credential.password.length < 8 ||
        credential.password.length > 64
      ) {
        errors.push({
          field: 'password',
          message: 'Password must be 8-64 characters',
        });
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // Create OTP session after successful validation
  createOtpSession(data: AuthorizeRequest): OtpSession {
    const sessionId = randomUUID();
    const session: OtpSession = {
      id: sessionId,
      credential: data.credential,
      acceptedTerms: data.acceptedTerms,
      otpLength: 6,
      maxAttempts: 3,
      attempts: 0,
      expiresAt: new Date(Date.now() + OTP_SESSION_EXPIRY_MS),
    };
    this.otpSessions.set(sessionId, session);
    return session;
  }

  // Generate masked hint for mobile
  generateOtpHint(credential: AuthorizeCredential): string {
    if (credential.mobile) {
      return `OTP has been sent to xxxx${credential.mobile.slice(-4)}`;
    }
    if (credential.ucic) {
      return `OTP has been sent to your registered mobile number`;
    }
    return 'OTP has been sent to your registered device';
  }

  // POST /login/token - verify OTP and generate tokens
  verifyOtpAndGenerateTokens(
    sessionId: string,
    otp: string
  ):
    | { valid: true; accessToken: string; refreshToken: string }
    | { valid: false; errors: ValidationError[] } {
    const otpSession = this.otpSessions.get(sessionId);

    if (!otpSession) {
      return {
        valid: false,
        errors: [
          { field: 'otp', message: 'Session expired. Please start over.' },
        ],
      };
    }

    if (new Date() > otpSession.expiresAt) {
      this.otpSessions.delete(sessionId);
      return {
        valid: false,
        errors: [
          { field: 'otp', message: 'OTP expired. Please request a new one.' },
        ],
      };
    }

    // Check OTP format (must match configured length)
    const otpRegex = new RegExp(`^\\d{${otpSession.otpLength}}$`);
    if (!otpRegex.test(otp)) {
      otpSession.attempts++;
      if (otpSession.attempts >= otpSession.maxAttempts) {
        this.otpSessions.delete(sessionId);
        return {
          valid: false,
          errors: [
            {
              field: 'otp',
              message: 'Maximum attempts exceeded. Please start over.',
            },
          ],
        };
      }
      return {
        valid: false,
        errors: [
          {
            field: 'otp',
            message: `OTP must be exactly ${otpSession.otpLength} digits`,
          },
        ],
      };
    }

    // For mock purposes, accept any OTP with correct format
    // In production, this would verify against a sent OTP
    this.otpSessions.delete(sessionId);

    // Generate tokens
    const accessToken = this.generateAccessToken(otpSession.credential);
    const refreshToken = randomUUID();

    // Store token for validation
    this.accessTokens.set(accessToken, {
      accessToken,
      refreshToken,
      credential: otpSession.credential,
      expiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRY_MS),
    });

    // Create authenticated session
    const authSessionId = randomUUID();
    this.sessions.set(authSessionId, {
      id: authSessionId,
      credential: otpSession.credential,
      createdAt: new Date(),
    });

    return { valid: true, accessToken, refreshToken };
  }

  // Generate mock JWT-like access token
  private generateAccessToken(credential: AuthorizeCredential): string {
    // In production, this would generate a proper JWT
    // For mock, create a base64-encoded token with user info
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    ).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: credential.ucic || credential.mobile || 'user',
        type: credential.type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor((Date.now() + ACCESS_TOKEN_EXPIRY_MS) / 1000),
      })
    ).toString('base64url');
    const signature = Buffer.from('mock-signature').toString('base64url');
    return `${header}.${payload}.${signature}`;
  }

  // Validate access token for protected routes
  validateAccessToken(
    token: string
  ): { valid: true; credential: AuthorizeCredential } | { valid: false } {
    const storedToken = this.accessTokens.get(token);

    if (!storedToken) {
      return { valid: false };
    }

    if (new Date() > storedToken.expiresAt) {
      this.accessTokens.delete(token);
      return { valid: false };
    }

    return { valid: true, credential: storedToken.credential };
  }

  // Generate journey config (public - no auth required)
  // Note: Preview and Submit steps are hardcoded in the app, not returned from API
  generateJourneyConfig(_clientId?: string): JourneyConfig {
    // In production, this could return different configs based on clientId
    return {
      journeyType: 'customer-fd',
      logoUrl: 'https://placeholder.co/120x40?text=BankLogo',
      interestRatesUrl: 'https://example.com/interest-rates',
      // Preview and Submit FD are hardcoded in the app
      stepTitles: ['Deposit Details', 'Bank Details'],
      requiredAggregates: [
        {
          key: 'depositDetails',
          label: 'Deposit Details',
          fields: {
            fdType: {
              type: 'radio',
              label: 'FD Type',
              required: true,
              options: [
                { value: 'withdrawable', label: 'Withdrawable FD' },
                { value: 'non-withdrawable', label: 'Non-Withdrawable FD' },
              ],
            },
            amount: {
              type: 'number',
              label: 'FD Amount',
              required: true,
              placeholder: 'Enter FD amount',
              validation: {
                min: 5000,
                max: 1000000000,
                message: 'Amount must be between ₹5,000 and ₹1,00,00,00,000',
              },
            },
            interestPayout: {
              type: 'radio',
              label: 'Interest Payout',
              required: true,
              options: [
                { value: 'at-maturity', label: 'At Maturity' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
              ],
            },
            maturityInstructions: {
              type: 'select',
              label: 'Maturity Instructions',
              required: true,
              options: [
                { value: 'DO_NOT_RENEW', label: 'Do Not Renew' },
                { value: 'RENEW_PRINCIPAL', label: 'Renew Principal' },
                {
                  value: 'RENEW_PRINCIPAL_AND_INTEREST',
                  label: 'Renew Principal and Interest',
                },
              ],
            },
            tenureYears: { type: 'number', label: 'Years', required: true },
            tenureMonths: { type: 'number', label: 'Months', required: true },
            tenureDays: { type: 'number', label: 'Days', required: true },
          },
        },
        {
          key: 'bankDetails',
          label: 'Bank Details',
          fields: {
            fundingOption: {
              type: 'radio',
              label: 'Fund your FD via',
              required: true,
              options: [
                { value: 'other-bank', label: 'Other Bank' },
                { value: 'primary-bank', label: 'Primary Bank' },
                { value: 'combined-funds', label: 'Combined Funds' },
              ],
            },
            primaryAmount: {
              type: 'number',
              label: 'Amount from Primary Bank',
              required: false,
            },
            otherBankAccount: {
              type: 'text',
              label: 'Other Bank Account',
              required: false,
            },
            branch: { type: 'text', label: 'Branch', required: true },
            addNominee: {
              type: 'checkbox',
              label: 'Add Nominee to FD',
              required: false,
            },
          },
        },
      ],
      components: {
        'deposit-details': {
          id: 'deposit-details',
          type: 'DepositDetails',
          props: {
            allowedFdTypes: ['withdrawable', 'non-withdrawable'],
          },
        },
        'bank-details': {
          id: 'bank-details',
          type: 'BankDetails',
          props: {
            fdAmount: 10000,
            primaryAccount: {
              accountNumber: '***12',
              accountType: 'SAVINGS ACCOUNT',
              availableBalance: 100000,
            },
          },
        },
        // preview-step and submit-step are hardcoded in the app
      },
      layout: {
        type: 'stepper',
        config: {
          stepTitles: ['Deposit Details', 'Bank Details'],
        },
        children: [
          { componentId: 'deposit-details' },
          { componentId: 'bank-details' },
          // preview-step and submit-step are hardcoded in the app
        ],
      },
    };
  }

  validateDeposit(data: DepositRequest): ValidationResult {
    const errors: ValidationError[] = [];
    const amount = parseFloat(data.amount);
    const years = parseInt(data.tenureYears, 10) || 0;
    const months = parseInt(data.tenureMonths, 10) || 0;
    const days = parseInt(data.tenureDays, 10) || 0;
    const totalDays = years * 365 + months * 30 + days;

    // Validate FD Type
    if (
      !data.fdType ||
      !['withdrawable', 'non-withdrawable'].includes(data.fdType)
    ) {
      errors.push({
        field: 'fdType',
        message: 'Please select a valid FD type',
      });
    }

    // Validate Amount
    if (!data.amount || Number.isNaN(amount)) {
      errors.push({ field: 'amount', message: 'Please enter a valid amount' });
    } else if (amount < 5000) {
      errors.push({ field: 'amount', message: 'Minimum amount is ₹5,000' });
    } else if (amount > 1000000000) {
      errors.push({
        field: 'amount',
        message: 'Maximum amount is ₹1,000,000,000',
      });
    }

    // Validate Interest Payout
    if (
      !data.interestPayout ||
      !['at-maturity', 'monthly', 'quarterly'].includes(data.interestPayout)
    ) {
      errors.push({
        field: 'interestPayout',
        message: 'Please select a valid interest payout option',
      });
    }

    // Validate Maturity Instructions
    const validMaturityInstructions = [
      'DO_NOT_RENEW',
      'RENEW_PRINCIPAL',
      'RENEW_PRINCIPAL_AND_INTEREST',
    ];
    if (
      !data.maturityInstructions ||
      !validMaturityInstructions.includes(data.maturityInstructions)
    ) {
      errors.push({
        field: 'maturityInstructions',
        message: 'Please select valid maturity instructions',
      });
    }

    // Validate Tenure
    if (totalDays < 7) {
      errors.push({ field: 'tenure', message: 'Minimum tenure is 7 days' });
    } else if (totalDays > 3650) {
      errors.push({ field: 'tenure', message: 'Maximum tenure is 10 years' });
    }

    // Special validation for "At Maturity" payout option
    if (
      data.interestPayout === 'at-maturity' &&
      (totalDays < 7 || totalDays > 180)
    ) {
      errors.push({
        field: 'interestPayout',
        message:
          'For "At Maturity" payout, tenure must be between 7 and 180 days',
      });
    }

    return { valid: errors.length === 0, errors };
  }

  validateBank(data: BankRequest): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate funding option
    const validFundingOptions = [
      'other-bank',
      'primary-bank',
      'combined-funds',
    ];
    if (
      !data.fundingOption ||
      !validFundingOptions.includes(data.fundingOption)
    ) {
      errors.push({
        field: 'fundingOption',
        message: 'Please select a valid funding option',
      });
    }

    // Validate primary bank amount for combined-funds option
    if (data.fundingOption === 'combined-funds') {
      const primaryAmount = parseFloat(data.primaryAmount || '0');
      if (
        !data.primaryAmount ||
        Number.isNaN(primaryAmount) ||
        primaryAmount <= 0
      ) {
        errors.push({
          field: 'primaryAmount',
          message: 'Please enter a valid amount from primary bank',
        });
      }
    }

    // Validate branch for primary-bank and combined-funds options
    if (
      data.fundingOption === 'primary-bank' ||
      data.fundingOption === 'combined-funds'
    ) {
      if (!data.branch) {
        errors.push({ field: 'branch', message: 'Please select a branch' });
      }
    }

    // For other-bank and combined-funds, validate other bank account details
    if (
      data.fundingOption === 'other-bank' ||
      data.fundingOption === 'combined-funds'
    ) {
      if (!data.otherBankAccount) {
        errors.push({
          field: 'otherBankAccount',
          message: 'Please add a bank account',
        });
      } else {
        // Validate account number (9-18 digits for Indian bank accounts)
        if (
          !data.otherBankAccount.accountNumber ||
          !/^\d{9,18}$/.test(data.otherBankAccount.accountNumber)
        ) {
          errors.push({
            field: 'accountNumber',
            message: 'Account number must be 9-18 digits',
          });
        }

        // Validate IFSC (4 letter bank code + 0 + 6 alphanumeric characters)
        if (
          !data.otherBankAccount.ifsc ||
          !/^[A-Z]{3,4}0[A-Z0-9]{5,6}$/.test(data.otherBankAccount.ifsc)
        ) {
          errors.push({
            field: 'ifsc',
            message: 'Please enter a valid IFSC code (e.g., SBI0009101)',
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  getSession(sessionId: string): SessionData | null {
    return this.sessions.get(sessionId) || null;
  }

  // Get session by access token
  getSessionByToken(accessToken: string): SessionData | null {
    const tokenData = this.accessTokens.get(accessToken);
    if (!tokenData) return null;

    // Find session with matching credential
    const sessions = Array.from(this.sessions.values());
    const matchedSession = sessions.find(
      (session) =>
        session.credential.mobile === tokenData.credential.mobile ||
        session.credential.ucic === tokenData.credential.ucic
    );
    return matchedSession || null;
  }

  updateSession(
    sessionId: string,
    stepId: 'deposit' | 'bank',
    data: DepositRequest | BankRequest
  ): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    if (stepId === 'deposit') {
      session.depositData = data as DepositRequest;
    } else if (stepId === 'bank') {
      session.bankData = data as BankRequest;
    }

    return true;
  }

  // Update session by token instead of session ID
  updateSessionByToken(
    accessToken: string,
    stepId: 'deposit' | 'bank',
    data: DepositRequest | BankRequest
  ): boolean {
    const session = this.getSessionByToken(accessToken);
    if (!session) return false;

    if (stepId === 'deposit') {
      session.depositData = data as DepositRequest;
    } else if (stepId === 'bank') {
      session.bankData = data as BankRequest;
    }

    return true;
  }

  // Calculate current step based on saved session data
  // Steps: 0=Login, 1=Deposit Details, 2=Bank Details, 3=Preview, 4=Submit
  calculateCurrentStep(session: SessionData): number {
    // If both deposit and bank data exist, user is at preview step
    if (session.depositData && session.bankData) {
      return 3; // Preview step
    }
    // If only deposit data exists, user is at bank details step
    if (session.depositData) {
      return 2; // Bank Details step
    }
    // No data saved yet, user should be at deposit details (step 1, after login)
    return 1; // Deposit Details step
  }

  // POST /my/fd/calculator - Calculate FD interest and maturity amount
  calculateFD(
    data: FDCalculatorRequest
  ):
    | { valid: true; result: FDCalculatorResponse }
    | { valid: false; errors: ValidationError[] } {
    const errors: ValidationError[] = [];

    const principal = parseFloat(data.amount);
    const years = parseInt(data.tenureYears, 10) || 0;
    const months = parseInt(data.tenureMonths, 10) || 0;
    const days = parseInt(data.tenureDays, 10) || 0;
    const tenureInDays = years * 365 + months * 30 + days;

    // Validate inputs
    if (!data.amount || Number.isNaN(principal) || principal <= 0) {
      errors.push({ field: 'amount', message: 'Please enter a valid amount' });
    }

    if (tenureInDays < 7) {
      errors.push({ field: 'tenure', message: 'Minimum tenure is 7 days' });
    } else if (tenureInDays > 3650) {
      errors.push({ field: 'tenure', message: 'Maximum tenure is 10 years' });
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    // Determine interest rate based on tenure and FD type
    // Non-withdrawable FDs get slightly higher rates
    const baseRate = this.getInterestRate(tenureInDays);
    const interestRate =
      data.fdType === 'non-withdrawable' ? baseRate + 0.25 : baseRate;

    // Calculate interest earned and maturity amount
    // Using simple interest for monthly/quarterly payouts, compound for at-maturity
    let interestEarned: number;
    let maturityAmount: number;

    if (data.interestPayout === 'at-maturity') {
      // Compound interest (quarterly compounding)
      const n = 4; // Quarterly compounding
      const t = tenureInDays / 365;
      maturityAmount = principal * ((1 + interestRate / 100 / n) ** (n * t));
      interestEarned = maturityAmount - principal;
    } else {
      // Simple interest for periodic payouts
      const t = tenureInDays / 365;
      interestEarned = principal * (interestRate / 100) * t;
      maturityAmount = principal + interestEarned;
    }

    // Calculate maturity date
    const maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + tenureInDays);

    return {
      valid: true,
      result: {
        principal,
        interestRate,
        interestEarned: Math.round(interestEarned * 100) / 100,
        maturityAmount: Math.round(maturityAmount * 100) / 100,
        maturityDate: maturityDate.toISOString().split('T')[0],
        tenureInDays,
      },
    };
  }

  // Get interest rate based on tenure (mock rates similar to typical FD rates)
  private getInterestRate(tenureInDays: number): number {
    if (tenureInDays <= 45) return 4.5;
    if (tenureInDays <= 90) return 5.5;
    if (tenureInDays <= 180) return 6.0;
    if (tenureInDays <= 365) return 6.5;
    if (tenureInDays <= 730) return 7.0;
    if (tenureInDays <= 1095) return 7.1;
    return 6.5; // Rates typically decrease for very long tenures
  }

  // GET /branches - Get branches at a location
  getBranches(params?: BranchesRequest): Branch[] {
    if (!params || Object.values(params).every((v) => !v)) {
      // No filters provided, return all branches (without internal metadata)
      return this.stripLocationMetadata(DEFAULT_BRANCHES);
    }

    // Filter branches based on provided params
    const filtered = DEFAULT_BRANCHES.filter((branch) => {
      if (params.country && branch.country !== params.country) return false;
      if (params.state && branch.state !== params.state) return false;
      if (
        params.city &&
        branch.city?.toLowerCase() !== params.city.toLowerCase()
      )
        return false;
      if (
        params.district &&
        branch.district?.toLowerCase() !== params.district.toLowerCase()
      )
        return false;
      if (params.pin && branch.pin !== params.pin) return false;
      return true;
    });

    return this.stripLocationMetadata(filtered);
  }

  // Remove internal location metadata from response
  private stripLocationMetadata(branches: Branch[]): Branch[] {
    return branches.map(({ address, code, ifsc, name }) => ({
      address,
      code,
      ifsc,
      name,
    }));
  }

  // GET /ifsc/:code - Lookup bank details by IFSC code
  lookupIFSC(
    ifscCode: string
  ):
    | { valid: true; result: IFSCLookupResponse }
    | { valid: false; errors: ValidationError[] } {
    if (!ifscCode || !/^[A-Z]{3,4}0[A-Z0-9]{5,6}$/.test(ifscCode)) {
      return {
        valid: false,
        errors: [
          {
            field: 'ifsc',
            message: 'Please enter a valid IFSC code (e.g., SBI0009101)',
          },
        ],
      };
    }

    // Mock IFSC database: map bank prefixes to bank names
    const bankPrefixes: Record<
      string,
      {
        bankName: string;
        branches: Record<string, { branchName: string; city: string }>;
      }
    > = {
      SBIN: {
        bankName: 'State Bank of India',
        branches: {
          SBIN0009101: {
            branchName: 'MUMBAI MAIN',
            city: 'Mumbai, Maharashtra',
          },
          SBIN0001234: { branchName: 'DELHI MAIN', city: 'New Delhi, Delhi' },
          SBIN0002345: {
            branchName: 'BANGALORE MAIN',
            city: 'Bangalore, Karnataka',
          },
        },
      },
      SBI: {
        bankName: 'State Bank of India',
        branches: {
          SBI0009101: {
            branchName: 'MUMBAI MAIN',
            city: 'Mumbai, Maharashtra',
          },
        },
      },
      ICIC: {
        bankName: 'ICICI Bank',
        branches: {
          ICIC0001234: {
            branchName: 'ANDHERI WEST',
            city: 'Mumbai, Maharashtra',
          },
          ICIC0002345: {
            branchName: 'CONNAUGHT PLACE',
            city: 'New Delhi, Delhi',
          },
        },
      },
      HDFC: {
        bankName: 'HDFC Bank',
        branches: {
          HDFC0000003: { branchName: 'K G MARG', city: 'New Delhi, Delhi' },
          HDFC0000101: {
            branchName: 'ANDHERI WEST',
            city: 'Mumbai, Maharashtra',
          },
          HDFC0000104: {
            branchName: 'NARIMAN POINT',
            city: 'Mumbai, Maharashtra',
          },
        },
      },
      PUNB: {
        bankName: 'Punjab National Bank',
        branches: {},
      },
      BARB: {
        bankName: 'Bank of Baroda',
        branches: {},
      },
    };

    // Try 4-letter prefix first, then 3-letter
    const prefix4 = ifscCode.substring(0, 4);
    const prefix3 = ifscCode.substring(0, 3);
    const bankData = bankPrefixes[prefix4] || bankPrefixes[prefix3];

    if (!bankData) {
      // For unknown prefixes, generate a generic response
      return {
        valid: true,
        result: {
          bankName: `${prefix4} Bank`,
          branchName: ifscCode,
          city: 'India',
        },
      };
    }

    const specificBranch = bankData.branches[ifscCode];
    return {
      valid: true,
      result: {
        bankName: bankData.bankName,
        branchName: specificBranch?.branchName || ifscCode.substring(4),
        city: specificBranch?.city || 'India',
      },
    };
  }

  // POST /account/verify - Verify bank account number
  verifyAccount(
    accountNumber: string,
    ifsc: string
  ):
    | { valid: true; result: AccountVerifyResponse }
    | { valid: false; errors: ValidationError[] } {
    if (!accountNumber || !/^\d{9,18}$/.test(accountNumber)) {
      return {
        valid: false,
        errors: [
          {
            field: 'accountNumber',
            message: 'Account number must be 9-18 digits',
          },
        ],
      };
    }

    if (!ifsc || !/^[A-Z]{3,4}0[A-Z0-9]{5,6}$/.test(ifsc)) {
      return {
        valid: false,
        errors: [{ field: 'ifsc', message: 'Please enter a valid IFSC code' }],
      };
    }

    // For mock purposes, all valid-format account numbers are "verified"
    return {
      valid: true,
      result: {
        verified: true,
      },
    };
  }

  // GET /my/nominee - Get existing nominee details for the authenticated user
  getNominee(
    accessToken: string
  ): NomineeResponse | { success: false; errors: ValidationError[] } {
    const tokenValidation = this.validateAccessToken(accessToken);
    if (!tokenValidation.valid) {
      return {
        success: false,
        errors: [{ field: 'auth', message: 'Unauthorized' }],
      };
    }

    // Mock: return a pre-existing nominee for the user
    return {
      success: true,
      nominee: {
        fullName: 'Priya Sharma',
        dateOfBirth: '15/03/1990',
        relationship: 'Spouse',
      },
    };
  }

  // GET /translations/:lang - Get language pack for the requested language
  async getTranslations(lang: string): Promise<Record<string, unknown>> {
    const supportedLanguages = ['en', 'hi', 'gu', 'ma'];
    const language = supportedLanguages.includes(lang) ? lang : 'en';

    // Dynamic import of the JSON language pack
    const langPack = await import(`./language-packs/${language}.json`);
    return langPack.default || langPack;
  }

  static from() {
    return new MockServer();
  }
}
