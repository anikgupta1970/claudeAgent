import { z } from 'zod';

// ============================================
// Login schemas
// ============================================

export const loginTermsResponseSchema = z.object({
  terms: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    required: z.boolean(),
  })),
});

export const authorizeRequestSchema = z.object({
  acceptedTerms: z.array(z.object({ id: z.string() })),
  credential: z.object({
    type: z.string(),
    mobile: z.string().optional(),
    dob: z.string().optional(),
    pan: z.string().optional(),
  }),
});

export const authorizeResponseSchema = z.object({
  sessionId: z.string(),
  hint: z.string(),
  otpLength: z.number(),
  maxAttempts: z.number(),
  expiresIn: z.number(),
});

export const tokenExchangeRequestSchema = z.object({
  sessionId: z.string(),
  otp: z.string(),
});

export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string().optional(),
  expiresIn: z.number().optional(),
});

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

// ============================================
// Processing schemas
// ============================================

export const processingTokenRequestSchema = z.object({
  claims: z.object({
    customer_id: z.string(),
    client_id: z.string(),
  }),
});

export const processingTokenResponseSchema = z.object({
  access_token: z.string(),
});

// ============================================
// Branch/location schemas
// ============================================

export const branchQuerySchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pin: z.string().optional(),
  postalCode: z.string().optional(),
});

export const branchStatesQuerySchema = z.object({
  country: z.string().optional(),
});

export const branchCitiesQuerySchema = z.object({
  country: z.string().optional(),
  state: z.string(),
});

export const locationQuerySchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  facility: z.string().optional(),
});

// ============================================
// Mock endpoint schemas
// ============================================

export const depositDetailsRequestSchema = z.object({
  fdType: z.enum(['withdrawable', 'non-withdrawable']),
  amount: z.string(),
  interestPayout: z.enum(['at-maturity', 'monthly', 'quarterly']),
  maturityInstructions: z.string(),
  tenureYears: z.string(),
  tenureMonths: z.string(),
  tenureDays: z.string(),
});

export const bankDetailsRequestSchema = z.object({
  fundingOption: z.enum(['other-bank', 'primary-bank', 'combined-funds']),
  branch: z.string(),
  primaryAmount: z.string().optional(),
  otherBankAccount: z.string().optional(),
  addNominee: z.boolean(),
});

export const accountVerifyRequestSchema = z.object({
  accountNumber: z.string(),
  ifsc: z.string(),
});
