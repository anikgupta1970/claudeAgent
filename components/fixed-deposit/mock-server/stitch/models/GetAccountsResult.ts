/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money.js';
import type { Nomination } from './Nomination.js';
/**
 * Account information and balance details for a customer
 */
export type GetAccountsResult = {
    /**
     * A unique identifier which is a secure substitute of customer actual bank account number
     */
    accountId: string;
    /**
     * A unique identifier number assigned to a bank account. Partially masked to protect information
     */
    accountNo: string;
    /**
     * The current available balance in the account
     */
    currentBalance: Money;
    /**
     * Maximum amount that can be withdrawn or transferred from this account, including currency specification and overdraft limits if applicable
     */
    drawingLimit: Money;
    /**
     * Current nomination details for this account, specifying the beneficiaries who will inherit the account proceeds
     */
    nomination?: Nomination;
};

