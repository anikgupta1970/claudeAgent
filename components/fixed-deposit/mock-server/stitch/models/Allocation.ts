/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money.js';
import type { ProductCategory } from './ProductCategory.js';
/**
 * Account allocation details for the account opening instructions submitted in the application form.
 */
export type Allocation = {
    /**
     * Unique identifier for the instruction
     */
    instructionId?: string;
    /**
     * Unique identifier for new account created
     */
    accountId?: string;
    productCategory?: ProductCategory;
    /**
     * Total amount that will be available at maturity, including principal and all accumulated interest, specified with currency
     */
    maturityAmount?: Money;
    /**
     * The percentage at which interest is to be earned on a Fixed Deposit over the specified tenure.
     */
    roi?: number;
};

