/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Results for account holder in account opening instructions
 */
export type AccountHolderResult = {
    /**
     * It defines the sequence for account holder
     */
    order?: number;
    /**
     * Reference to the CreateIndividualCustomerInstruction in case the account holder is new customer
     */
    id?: string;
    /**
     * Customer id of the account holder
     */
    customerId?: string;
};

