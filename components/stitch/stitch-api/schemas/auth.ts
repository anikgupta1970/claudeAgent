import { z } from 'zod';
import { isoDateSchema } from './common.js';

/**
 * Mobile number in E.164 format
 */
export const mobileSchema = z
  .string()
  .min(3)
  .max(16)
  .regex(/^\+[1-9]\d{1,14}$/);

/**
 * PAN number - 10 alphanumeric characters
 */
export const panSchema = z
  .string()
  .length(10)
  .regex(/[A-Z]{5}[0-9]{4}[A-Z]/);

/**
 * Find customer with mobile and DOB
 */
export const findCustomerWithMobileAndDobSchema = z.object({
  mobile: mobileSchema,
  dob: isoDateSchema,
});

/**
 * Find customer with mobile and PAN
 */
export const findCustomerWithMobileAndPanSchema = z.object({
  mobile: mobileSchema,
  pan: panSchema,
});

/**
 * Find customer arguments - union of mobile+dob or mobile+pan
 * Based on OpenAPI spec: components/schemas/FindCustomerArgs
 */
export const findCustomerArgsSchema = z.union([
  findCustomerWithMobileAndDobSchema,
  findCustomerWithMobileAndPanSchema,
]);

/**
 * Claim schema
 */
export const claimSchema = z.object({
  name: z.string().optional(),
  value: z.string().optional(),
});

/**
 * Token claims response schema
 */
export const tokenClaimsResponseSchema = z.object({
  claims: z.array(claimSchema).optional(),
});

// Type exports
export type FindCustomerArgsInput = z.input<typeof findCustomerArgsSchema>;
export type TokenClaimsResponseOutput = z.output<typeof tokenClaimsResponseSchema>;
