/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Customer information and personal details
 */
export type Customer = {
    /**
     * A unique identifier assigned to customers by the bank.
     *
     */
    customerId: string;
    /**
     * Full name of the customer
     */
    name: string;
    /**
     * Mobile number of the customer in (E.164 format)
     */
    mobile: string;
    /**
     * The date on which the individual was born in ISO 8601 format (YYYY-MM-DD)
     */
    dob: string;
    /**
     * Permanent Account Number
     */
    pan: string;
};

