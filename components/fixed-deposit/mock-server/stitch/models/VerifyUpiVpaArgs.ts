/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Arguments for UPI VPA verification process
 */
export type VerifyUpiVpaArgs = {
    /**
     * A unique identifier assigned to customers by the bank.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters
     */
    customerId: string;
    /**
     * Virtual payment address for UPI Transactions. Mandatory in case of Payment Mode as UPI
     */
    vpa: string;
};

