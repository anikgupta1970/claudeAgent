import { z } from 'zod';
import { customerIdSchema } from './common.js';

/**
 * Verification status enum
 */
export const verificationStatusSchema = z.enum(['success', 'failed']);

/**
 * IFSC code schema - 11 characters
 */
export const ifscSchema = z
  .string()
  .length(11)
  .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/);

/**
 * Bank account verification request schema
 * Based on OpenAPI spec: components/schemas/VerifyBankAccountArgs
 */
export const verifyBankAccountRequestSchema = z.object({
  customerId: customerIdSchema,
  accountNo: z.string().min(1),
  ifsc: ifscSchema,
});

/**
 * Bank account verification result schema
 * Based on OpenAPI spec: components/schemas/BankAccountVerificationResult
 */
export const bankAccountVerificationResultSchema = z.object({
  status: verificationStatusSchema,
  reason: z.string().optional(),
});

/**
 * UPI VPA schema
 */
export const upiVpaSchema = z.string().min(1).max(255);

/**
 * UPI VPA verification request schema
 * Based on OpenAPI spec: components/schemas/VerifyUpiVpaArgs
 */
export const verifyUpiVpaRequestSchema = z.object({
  customerId: customerIdSchema,
  vpa: upiVpaSchema,
});

/**
 * UPI VPA verification result schema
 * Based on OpenAPI spec: components/schemas/UpiVpaVerificationResult
 */
export const upiVpaVerificationResultSchema = z.object({
  status: verificationStatusSchema,
  reason: z.string().optional(),
});

// Type exports
export type VerifyBankAccountRequestInput = z.input<typeof verifyBankAccountRequestSchema>;
export type BankAccountVerificationResultOutput = z.output<typeof bankAccountVerificationResultSchema>;
export type VerifyUpiVpaRequestInput = z.input<typeof verifyUpiVpaRequestSchema>;
export type UpiVpaVerificationResultOutput = z.output<typeof upiVpaVerificationResultSchema>;
