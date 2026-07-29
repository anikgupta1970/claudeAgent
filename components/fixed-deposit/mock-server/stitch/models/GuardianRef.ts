/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerRefType } from './CustomerRefType.js';
/**
 * Reference to a guardian for a minor account holder
 */
export type GuardianRef = {
    /**
     * A unique identifier assigned to customers by the bank. <br> This field is required when type is "customer_id" ; otherwise, it will be ignored even if provided. <br> If the values are only numeric, then allowed length is 6 to 12 characters. <br> If the values are other than numeric, then allowed length is 6 to 48 characters.
     */
    customerId?: string;
    /**
     * Type of reference being used to identify the guardian (either direct customer ID or reference key)
     */
    type: CustomerRefType;
    /**
     * Conditionally Required - This field is mandatory when type is 'ref' Identifier of the 'guardian''section in the form with (NTB) guardian details. This field is required if type is 'ref'.
     */
    ref?: string;
};

