/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BankAccountVerificationResult } from '../models/BankAccountVerificationResult.js';
import type { UpiVpaVerificationResult } from '../models/UpiVpaVerificationResult.js';
import type { VerifyBankAccountArgs } from '../models/VerifyBankAccountArgs.js';
import type { VerifyUpiVpaArgs } from '../models/VerifyUpiVpaArgs.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class VerificationService {
    /**
     * Verify bank account ownership
     * This operation allows to verify the ownership of a bank account.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns BankAccountVerificationResult OK
     * @throws ApiError
     */
    public static postIndividualCustomersVerificationsBankAccount(
        requestBody: VerifyBankAccountArgs,
        traceparent?: string,
    ): CancelablePromise<BankAccountVerificationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/individual-customers/verifications/bank-account',
            headers: {
                'traceparent': traceparent,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                424: `Failed Dependency`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Verify UPI Id
     * This operation allows to verify a UPI ID.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns UpiVpaVerificationResult OK
     * @throws ApiError
     */
    public static postIndividualCustomersVerificationsUpiVpa(
        requestBody: VerifyUpiVpaArgs,
        traceparent?: string,
    ): CancelablePromise<UpiVpaVerificationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/individual-customers/verifications/upi-vpa',
            headers: {
                'traceparent': traceparent,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                424: `Failed Dependency`,
                500: `Internal Server Error`,
            },
        });
    }
}
