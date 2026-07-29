/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Arguments for bank account verification process
 */
export type VerifyBankAccountArgs = {
    /**
     * A unique identifier assigned to customers by the bank.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters
     */
    customerId: string;
    /**
     * Bank account number to be verified
     */
    accountNo: string;
    /**
     * IFSC code of the bank for account verification
     */
    ifsc: string;
};

