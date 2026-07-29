/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerRefType } from './CustomerRefType.js';
import type { DirectBenefitTransfer } from './DirectBenefitTransfer.js';
/**
 * Reference to a single (non-joint) customer account holder
 */
export type SavingsSoloCustomerRef = {
    /**
     * A unique identifier assigned to customers by the bank.<br>This field is required when type is "customer_id" ; otherwise, it will be ignored even if provided.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters.
     */
    customerId?: string;
    /**
     * Reference method used to identify the sole account holder (customer ID or reference key)
     */
    type: CustomerRefType;
    /**
     * Identifier of the form section with customer details.<br>This field is required when type is "ref".
     */
    ref?: string;
    /**
     * Direct Benefit Transfer consent provided by the customer
     */
    directBenefitTransfer?: DirectBenefitTransfer;
};

