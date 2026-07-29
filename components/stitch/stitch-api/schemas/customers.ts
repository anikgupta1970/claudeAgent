import { z } from 'zod';
import { moneySchema, customerIdSchema, postalAddressSchema, isoDateSchema } from './common.js';

/**
 * Account permission enum
 */
export const accountPermissionSchema = z.enum(['debit']);

/**
 * Nomination method enum
 */
export const nominationMethodSchema = z.enum(['successive', 'simultaneous']);

/**
 * Nominee guardian schema
 */
export const nomineeGuardianSchema = z.object({
  name: z.string().min(1).max(40),
  dob: isoDateSchema,
  address: postalAddressSchema,
  relationWithNominee: z.string().min(1).max(50).optional(),
  mobile: z.string().regex(/^\+[1-9]\d{1,14}$/).optional(),
  email: z.string().email().max(120).optional(),
});

/**
 * Nominee schema
 */
export const nomineeSchema = z.object({
  order: z.number().int(),
  name: z.string(),
  sharePct: z.number().optional(),
  dob: isoDateSchema.optional(),
  mobile: z.string().regex(/^\+[1-9]\d{1,14}$/).optional(),
  relationship: z.string().optional(),
  address: postalAddressSchema,
  guardian: nomineeGuardianSchema.optional(),
});

/**
 * Nomination schema
 */
export const nominationSchema = z.object({
  method: nominationMethodSchema,
  nominees: z.array(nomineeSchema),
});

/**
 * List accounts request schema
 * Based on OpenAPI spec: components/schemas/ListAccountsArgs
 */
export const listAccountsRequestSchema = z.object({
  customerId: customerIdSchema,
  permission: accountPermissionSchema,
  currency: z.string().length(3).regex(/^[A-Z]+$/),
});

/**
 * Account result schema
 * Based on OpenAPI spec: components/schemas/GetAccountsResult
 */
export const accountResultSchema = z.object({
  accountId: z.string(),
  accountNo: z.string(),
  currentBalance: moneySchema,
  drawingLimit: moneySchema,
  nomination: nominationSchema.optional(),
});

/**
 * Profile request schema
 * Based on OpenAPI spec: components/schemas/ProfileArgs
 */
export const profileRequestSchema = z.object({
  customerId: customerIdSchema,
});

/**
 * Profile response schema
 * Based on OpenAPI spec: components/schemas/Profile
 */
export const profileSchema = z.object({
  name: z.string(),
  mobile: z.string(),
  dob: isoDateSchema,
  pan: z.string().optional(),
  email: z.string().email().optional(),
});

/**
 * Find customer request schema
 */
export const findCustomerRequestSchema = z.object({
  mobile: z.string().optional(),
  pan: z.string().optional(),
  dob: isoDateSchema.optional(),
});

/**
 * Find customer result schema
 */
export const findCustomerResultSchema = z.object({
  customerId: customerIdSchema,
  name: z.string(),
  mobile: z.string(),
});

// Type exports
export type ListAccountsRequestInput = z.input<typeof listAccountsRequestSchema>;
export type AccountResultOutput = z.output<typeof accountResultSchema>;
export type ProfileRequestInput = z.input<typeof profileRequestSchema>;
export type ProfileOutput = z.output<typeof profileSchema>;
