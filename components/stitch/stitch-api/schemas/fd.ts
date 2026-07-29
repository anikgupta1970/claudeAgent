import { z } from 'zod';
import { moneySchema, customerIdSchema, durationSchema, isoDateSchema } from './common.js';

/**
 * FD Interest Payment Option enum
 */
export const fdInterestPaymentOptionSchema = z.enum([
  'at_maturity',
  'monthly',
  'quarterly',
]);

/**
 * FD Maturity Option enum
 */
export const fdMaturityOptionSchema = z.enum(['close', 'renew', 'transfer']);

/**
 * FD Renewal Option enum
 */
export const fdRenewalOptionSchema = z.enum(['full', 'principal']);

/**
 * Account reference schema
 */
export const accountRefSchema = z.object({
  accountId: z.string().min(10).max(48),
});

/**
 * Maturity instruction schema
 */
export const maturityInstructionSchema = z.object({
  option: fdMaturityOptionSchema,
  renewalOption: fdRenewalOptionSchema.optional(),
  payoutAccountId: z.string().optional(),
  payoutAccount: accountRefSchema.optional(),
  managersCheque: z.boolean().optional(),
});

/**
 * FD Calculator request schema
 * Based on OpenAPI spec: components/schemas/CalculationArgs
 */
export const fdCalculatorRequestSchema = z.object({
  customerId: customerIdSchema,
  productVariant: z.string().min(1),
  depositAmount: moneySchema,
  tenure: durationSchema,
  interestPaymentOption: fdInterestPaymentOptionSchema,
  maturityInstruction: maturityInstructionSchema,
});

/**
 * FD Calculator response schema
 * Based on OpenAPI spec: components/schemas/MaturityCalculationResult
 */
export const fdCalculatorResponseSchema = z.object({
  maturityAmount: moneySchema.optional(),
  roi: z.number().optional(),
  startDate: isoDateSchema.optional(),
  maturityDate: isoDateSchema.optional(),
  interestEarned: moneySchema.optional(),
});

// Type exports
export type FDCalculatorRequestInput = z.input<typeof fdCalculatorRequestSchema>;
export type FDCalculatorResponseOutput = z.output<typeof fdCalculatorResponseSchema>;
