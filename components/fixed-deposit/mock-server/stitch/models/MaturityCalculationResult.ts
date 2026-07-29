/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money.js';
/**
 * Calculated maturity details including amount and interest earned
 */
export type MaturityCalculationResult = {
    /**
     * Total amount that will be available at maturity, including principal and all accumulated interest, specified with currency
     */
    maturityAmount?: Money;
    /**
     * The percentage at which interest is to be earned on a deposit over the specified tenure
     */
    roi?: number;
    /**
     * The date on which the deposit was initiated in ISO 8601 format (YYYY-MM-DD)
     */
    startDate?: string;
    /**
     * The date on which desposit reaches the end of its term in ISO 8601 format (YYYY-MM-DD)
     */
    maturityDate?: string;
    /**
     * Total interest amount that will be earned over the FD tenure, calculated based on the rate and payout frequency
     */
    interestEarned?: Money;
};

