/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerRefType } from './CustomerRefType.js';
/**
 * Reference to a single (non-joint) customer account holder
 */
export type SoloCustomerRef = {
    /**
     * A unique identifier assigned to customers by the bank.<br> This field is required when type is "customer_id" ; otherwise, it will be ignored even if provided. <br> If the values are only numeric, then allowed length is 6 to 12 characters. <br> If the values are other than numeric, then allowed length is 6 to 48 characters.
     */
    customerId?: string;
    /**
     * Reference method used to identify the sole account holder (customer ID or reference key)
     */
    type: CustomerRefType;
    /**
     * Identifier of the form instruction with customer details.<br>This field is required if value of type (CustomerRefType) is 'ref'
     */
    ref?: string;
};

