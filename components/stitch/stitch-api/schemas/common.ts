import { z } from 'zod';

/**
 * Money schema - monetary value with currency
 */
export const moneySchema = z.object({
  amount: z.number(),
  currency: z
    .string()
    .length(3)
    .regex(/^[A-Z]+$/)
    .default('INR'),
});

/**
 * Postal address schema
 */
export const postalAddressSchema = z.object({
  lines: z
    .array(z.string().min(3).max(35))
    .min(1)
    .max(3),
  city: z.string().min(3).max(35),
  state: z
    .string()
    .min(2)
    .max(6)
    .regex(/^[A-Z]{2}(-[A-Z0-9]{1,3})?$/),
  pin: z
    .string()
    .length(6)
    .regex(/^[0-9]{6}$/),
  country: z
    .string()
    .length(2)
    .regex(/^[A-Z]{2}$/),
});

/**
 * Violation schema
 */
export const violationSchema = z.object({
  field: z.string(),
  in: z.enum(['body', 'header', 'query', 'path']).optional(),
  message: z.string(),
});

/**
 * RFC 7807 Problem schema
 */
export const problemSchema = z.object({
  status: z.number().int(),
  title: z.string(),
  instance: z.string().optional(),
  detail: z.string().optional(),
  violations: z.array(violationSchema).optional(),
});

/**
 * Customer ID - alphanumeric with underscores and hyphens
 */
export const customerIdSchema = z
  .string()
  .min(6)
  .max(48)
  .regex(/^[a-zA-Z0-9_-]+$/);

/**
 * ISO 8601 Duration format for tenure (e.g., "P1Y6M", "P1Y", "P6M", "P15D")
 */
export const durationSchema = z
  .string()
  .min(3)
  .max(12)
  .regex(/^P(\d+Y)?(\d+M)?(\d+D)?$/);

/**
 * ISO 8601 Date format (YYYY-MM-DD)
 */
export const isoDateSchema = z
  .string()
  .length(10)
  .regex(/^\d{4}-\d{2}-\d{2}$/);

/**
 * Traceparent header for distributed tracing (W3C Trace Context)
 */
export const traceparentSchema = z
  .string()
  .regex(/^[0-9a-f]{2}-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/)
  .optional();

// Type exports inferred from schemas
export type MoneyInput = z.input<typeof moneySchema>;
export type PostalAddressInput = z.input<typeof postalAddressSchema>;
export type ViolationInput = z.input<typeof violationSchema>;
export type ProblemInput = z.input<typeof problemSchema>;
