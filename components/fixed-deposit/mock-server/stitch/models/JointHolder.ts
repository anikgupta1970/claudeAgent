/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerRefType } from './CustomerRefType.js';
/**
 * Joint holder information for jointly held accounts
 */
export type JointHolder = {
    /**
     * A unique identifier assigned to customers by the bank.<br>This field is required when type is "customer_id" ; otherwise, it will be ignored even if provided.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters.
     */
    customerId?: string;
    /**
     * It defines the sequence in which nominees are listed. Mandatory if more than one nominee is listed
     */
    order: number;
    /**
     * Method used to reference this joint holder (either by direct customer ID or reference key)
     */
    type: CustomerRefType;
    /**
     * Identifier of the form instruction with customer details.<br>This field is required if type is "ref" ; otherwise, it will be ignored even if provided.<br>Must match exactly one instruction ID of type 'create_ind_customer' where the referenced customer is aged 18 or above.
     */
    ref?: string;
};

