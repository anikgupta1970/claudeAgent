/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Direct Benefit Transfer configuration
 */
export type DirectBenefitTransfer = {
    /**
     * Whether to enable this account for direct benefit transfer (government subsidies, pensions, etc.)
     */
    enableDirectBenefitTransfer: boolean;
    /**
     * IIN of existing bank from which benefit transfer needs to be transferred
     */
    existingBankIIN?: string;
};

