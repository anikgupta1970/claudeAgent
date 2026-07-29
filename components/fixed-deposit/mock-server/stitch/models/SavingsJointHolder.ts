/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerRefType } from './CustomerRefType.js';
import type { DirectBenefitTransfer } from './DirectBenefitTransfer.js';
/**
 * Joint holder information for jointly held savings accounts
 */
export type SavingsJointHolder = {
    /**
     * A unique identifier assigned to customers by the bank. <br> This field is required when type is "customer_id" ; otherwise, it will be ignored even if provided. <br> If the values are only numeric, then allowed length is 6 to 12 characters. <br> If the values are other than numeric, then allowed length is 6 to 48 characters.
     */
    customerId?: string;
    /**
     * It defines the sequence in which applicants are listed.
     */
    order: number;
    /**
     * Method used to reference this joint holder (either by direct customer ID or reference key)
     */
    type: CustomerRefType;
    /**
     * Identifier of the form instruction with customer details.<br>This field is required if type is 'ref' ; otherwise, it will be ignored even if provided.<br>Must match exactly one instruction ID of type 'create_ind_customer' where the referenced customer is aged 18 or above.
     */
    ref?: string;
    /**
     * Direct Benefit Transfer consent provided by the customer
     */
    directBenefitTransfer?: DirectBenefitTransfer;
};

