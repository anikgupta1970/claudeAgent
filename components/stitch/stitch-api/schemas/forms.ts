import { z } from 'zod';
import { customerIdSchema } from './common.js';

/**
 * Form status enum
 */
export const formStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

/**
 * Submit application form response schema
 */
export const submitApplicationFormStatusSchema = z.object({
  applicationId: z.string().optional(),
  status: z.string().optional(),
  message: z.string().optional(),
});

/**
 * Form status request schema
 */
export const formStatusRequestSchema = z.object({
  applicationId: z.string().min(1),
});

/**
 * Form status response schema
 */
export const formStatusResponseSchema = z.object({
  applicationId: z.string(),
  status: formStatusSchema,
  message: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Form step status schema
 */
export const formStepStatusSchema = z.object({
  step: z.string(),
  status: z.enum(['pending', 'completed', 'failed']),
  message: z.string().optional(),
});

/**
 * Detailed form status response schema
 */
export const formDetailedStatusResponseSchema = z.object({
  applicationId: z.string(),
  status: formStatusSchema,
  message: z.string().optional(),
  steps: z.array(formStepStatusSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

/**
 * Product category enum
 */
export const productCategorySchema = z.enum(['fd', 'sa']);

/**
 * Customer application form schema
 * Matches the Stitch Capture API /forms endpoint payload
 * Body contains instructions (what to open) and sections (payment + metadata)
 */
export const customerApplicationFormSchema = z.object({
  instructions: z.array(z.unknown()),
  sections: z.array(z.unknown()),
});

// Type exports
export type FormStatusRequestInput = z.input<typeof formStatusRequestSchema>;
export type CustomerApplicationFormInput = z.input<typeof customerApplicationFormSchema>;
