/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculationArgs } from '../models/CalculationArgs.js';
import type { MaturityCalculationResult } from '../models/MaturityCalculationResult.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class FdService {
    /**
     * Fetch FD maturity calculation
     * Operation to fetch the maturity calculation for given fixed deposit (FD) details
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns MaturityCalculationResult OK
     * @throws ApiError
     */
    public static postIndividualCustomersFdCalculator(
        requestBody: CalculationArgs,
        traceparent?: string,
    ): CancelablePromise<MaturityCalculationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/individual-customers/fd/calculator',
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
