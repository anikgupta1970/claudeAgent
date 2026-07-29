/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetAccountsResult } from '../models/GetAccountsResult.js';
import type { ListAccountsArgs } from '../models/ListAccountsArgs.js';
import type { Profile } from '../models/Profile.js';
import type { ProfileArgs } from '../models/ProfileArgs.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class InfoService {
    /**
     * Fetch customer accounts
     * This operation allows to fetch the accounts associated with the customer.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns GetAccountsResult OK
     * @throws ApiError
     */
    public static postIndividualCustomersInfoAccounts(
        requestBody: ListAccountsArgs,
        traceparent?: string,
    ): CancelablePromise<Array<GetAccountsResult>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/individual-customers/info/accounts',
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
     * Fetch profile for existing customer
     * This operation allows to fetch the profile of an existing customer using given profile search attributes.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns Profile OK
     * @throws ApiError
     */
    public static postIndividualCustomersInfoProfile(
        requestBody: ProfileArgs,
        traceparent?: string,
    ): CancelablePromise<Profile> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/individual-customers/info/profile',
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
