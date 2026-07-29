/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Find Customer With Mobile And Pan Args
 */
export type FindCustomerWithPanAndMobileArgs = {
    /**
     * Mobile number of the customer in E.164 format
     */
    mobile: string;
    /**
     * Permanent Account Number (PAN). This field is required if 'dob' is not provided.
     */
    pan: string;
};

