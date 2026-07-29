/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Find Customer With Mobile And Dob Args
 */
export type FindCustomerWithMobileAndDobArgs = {
    /**
     * Mobile number of the customer in E.164 format
     */
    mobile: string;
    /**
     * The date on which the customer was born in ISO 8601 format (YYYY-MM-DD). This field is required if 'pan' is not provided.
     */
    dob: string;
};

