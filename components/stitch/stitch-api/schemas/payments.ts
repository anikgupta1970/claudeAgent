import { z } from 'zod';
import { moneySchema, customerIdSchema } from './common.js';
import { ifscSchema } from './verifications.js';

/**
 * Payment method enum
 */
export const paymentMethodSchema = z.enum([
  'cash',
  'cheque',
  'upi',
  'transfer',
  'net_banking',
]);

/**
 * Payment transaction status enum
 */
export const paymentTransactionStatusSchema = z.enum([
  'success',
  'pending',
  'failed',
]);

/**
 * Payment status enum
 */
export const paymentStatusSchema = z.enum([
  'deposited',
  'unpaid',
  'paid',
  'initiated',
]);

/**
 * External bank account instrument schema
 */
export const externalBankAccountSchema = z.object({
  accountNo: z.string().min(5).max(50),
  ifsc: ifscSchema,
  customerName: z.string().max(100).optional(),
});

/**
 * UPI instrument schema
 */
export const upiInstrumentSchema = z.object({
  accountNo: z.string().min(5).max(50),
  customerName: z.string().max(100).optional(),
  vpa: z.string().min(1).max(100),
});

/**
 * Payment instrument (union of bank account and UPI)
 */
export const paymentInstrumentSchema = z.union([
  externalBankAccountSchema,
  upiInstrumentSchema,
]);

/**
 * Payment initiation request schema
 * Based on OpenAPI spec: components/schemas/PaymentInitiationArgs
 */
export const paymentInitiationRequestSchema = z.object({
  customerId: customerIdSchema,
  clientReferenceNumber: z.string().min(12).max(50),
  clientSuccessUrl: z.string().url().max(200),
  clientFailureUrl: z.string().url().max(200),
  method: paymentMethodSchema,
  instrument: paymentInstrumentSchema.optional(),
  amount: moneySchema,
});

/**
 * Payment link schema
 */
export const paymentLinkSchema = z.object({
  url: z.string().optional(),
  method: z.string().optional(),
  parameters: z.record(z.string()).optional(),
});

/**
 * Payment initiation result schema
 */
export const paymentInitiationResultSchema = z.object({
  paymentTxnId: z.string().optional(),
  paymentLink: paymentLinkSchema.optional(),
});

/**
 * Payment status request schema
 */
export const paymentStatusRequestSchema = z.object({
  clientReferenceNumber: z.string().nullable().optional(),
  paymentTxnId: z.string().nullable().optional(),
});

/**
 * Payment status result schema
 */
export const paymentStatusResultSchema = z.object({
  paymentTxnId: z.string().optional(),
  status: paymentTransactionStatusSchema.optional(),
  clientReferenceNumber: z.string().optional(),
});

// Type exports
export type PaymentInitiationRequestInput = z.input<typeof paymentInitiationRequestSchema>;
export type PaymentStatusRequestInput = z.input<typeof paymentStatusRequestSchema>;
