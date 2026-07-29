/**
 * Form status types
 */
export type FormStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Submit application form response
 * Based on OpenAPI spec: components/schemas/SubmitApplicationFormStatus
 */
export interface SubmitApplicationFormStatus {
  applicationId?: string;
  status?: string;
  message?: string;
}

/**
 * Form status request (for /forms/status endpoint)
 */
export interface FormStatusRequest {
  applicationId: string;
}

/**
 * Form status response
 */
export interface FormStatusResponse {
  applicationId: string;
  status: FormStatus;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Detailed form status response (for /forms/detailed-status endpoint)
 */
export interface FormDetailedStatusResponse {
  applicationId: string;
  status: FormStatus;
  message?: string;
  steps?: FormStepStatus[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Form step status
 */
export interface FormStepStatus {
  step: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}

/**
 * Customer application form (simplified)
 * The actual schema is very complex with nested sections
 */
export interface CustomerApplicationForm {
  applicationId: string;
  customerId: string;
  productCategory: 'fd' | 'sa';
  sections?: unknown[];
  instructions?: unknown[];
}
