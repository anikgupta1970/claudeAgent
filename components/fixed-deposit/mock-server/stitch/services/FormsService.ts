/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationDetailedStatus } from '../models/ApplicationDetailedStatus.js';
import type { ApplicationDetailedStatusInquiryArgs } from '../models/ApplicationDetailedStatusInquiryArgs.js';
import type { ApplicationProcessingStatus } from '../models/ApplicationProcessingStatus.js';
import type { ApplicationStatusInquiryArgs } from '../models/ApplicationStatusInquiryArgs.js';
import type { CustomerApplicationForm } from '../models/CustomerApplicationForm.js';
import type { SubmitApplicationFormStatus } from '../models/SubmitApplicationFormStatus.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class FormsService {
    /**
     * Submit application form
     * Operation to submit a customer application form. Returns the status of the submission.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @param idempotencyKey Idempotency key to ensure safe retries and check status of previous requests. Use a unique identifier (UUID recommended). If this key was used in a previous request, the API will return the current status of that original operation instead of creating a duplicate. This allows both safe retries and status inquiries using the same mechanism. See: https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header-06
     * @returns SubmitApplicationFormStatus Accepted
     * @throws ApiError
     */
    public static postForms(
        requestBody: CustomerApplicationForm,
        traceparent?: string,
        idempotencyKey?: string,
    ): CancelablePromise<SubmitApplicationFormStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forms',
            headers: {
                'traceparent': traceparent,
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                424: `Failed Dependency`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Fetch detailed application processing status
     * Operation to fetch the detailed processing status of a submitted application form.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns ApplicationDetailedStatus OK
     * @throws ApiError
     */
    public static postFormsDetailedStatus(
        requestBody: ApplicationDetailedStatusInquiryArgs,
        traceparent?: string,
    ): CancelablePromise<ApplicationDetailedStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forms/detailed-status',
            headers: {
                'traceparent': traceparent,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                424: `Failed Dependency`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Fetch application processing status
     * Operation to fetch the processing status of a submitted application form. Returns the current status of the application.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns ApplicationProcessingStatus OK
     * @throws ApiError
     */
    public static postFormsStatus(
        requestBody: ApplicationStatusInquiryArgs,
        traceparent?: string,
    ): CancelablePromise<ApplicationProcessingStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/forms/status',
            headers: {
                'traceparent': traceparent,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                424: `Failed Dependency`,
                500: `Internal Server Error`,
            },
        });
    }
}
