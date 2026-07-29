/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FindCustomerArgs } from '../models/FindCustomerArgs.js';
import type { TokenResponse } from '../models/TokenResponse.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class AuthService {
    /**
     * Token claims
     * This operation returns the list of claims which are to be added to access token.
     * @param requestBody
     * @param traceparent W3C Trace Context traceparent header for distributed tracing. See: https://www.w3.org/TR/trace-context/#traceparent-header
     * @returns TokenResponse OK
     * @throws ApiError
     */
    public static postAuthTokenClaims(
        requestBody: FindCustomerArgs,
        traceparent?: string,
    ): CancelablePromise<TokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/token/claims',
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
