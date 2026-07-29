/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Customer financial information
 */
export type Income = {
    /**
     * Primary source of funds.<br>The allowed values will have to comply with the 'sourceOfFunds' defined in '/fi/enums'.<br>However, other values can also be specified if they do not match the predefined ones.
     */
    sourceOfFunds: string;
    /**
     * Gross annual income slab.<br>The allowed values will have to comply with the 'grossAnnualIncome' defined in '/fi/enums'.
     */
    grossAnnualIncome: string;
};

