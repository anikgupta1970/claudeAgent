/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountPermission } from './AccountPermission.js';
/**
 * List all the accounts and its information for the specific customer.
 */
export type ListAccountsArgs = {
    /**
     * A unique identifier assigned to customers by the bank.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters
     */
    customerId: string;
    /**
     * Specifies the allowed operations on the account
     */
    permission: AccountPermission;
    /**
     * The currency in ISO 4217 alpha-3 code.
     */
    currency: string;
};

