/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Customer } from '../models/Customer.js';
import type { FindCustomerArgs } from '../models/FindCustomerArgs.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class CustomerService {
    /**
     * Search for existing customer
     * This operation allows to search existing customer using given search criteria.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns Customer OK
     * @throws ApiError
     */
    public static postIndividualCustomersFind(
        requestBody: FindCustomerArgs,
        traceparent?: string,
    ): CancelablePromise<Customer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/individual-customers/find',
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
