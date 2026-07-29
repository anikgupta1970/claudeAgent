/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerRefType } from './CustomerRefType.js';
/**
 * Reference to a minor customer (under 18 years of age)
 */
export type MinorCustomerRef = {
    /**
     * A unique identifier assigned to customers by the bank.<br>This field is required when type is "customer_id" ; otherwise, it will be ignored even if provided.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters.
     */
    customerId?: string;
    /**
     * Reference method used to identify the minor customer (direct customer ID or reference key)
     */
    type: CustomerRefType;
    /**
     * Identifier of the form instruction with minor customer details.<br>This field is required when type is "ref" ; otherwise, it will be ignored even if provided.<br>Must match exactly one instruction ID of type 'create_ind_customer' where the referenced customer is aged less than 18.
     */
    ref?: string;
};

