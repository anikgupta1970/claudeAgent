/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Customer profile information including personal and contact details
 */
export type Profile = {
    /**
     * Customer's full name as registered in the bank records
     */
    name: string;
    /**
     * Customer's primary mobile phone number (in E.164 format) used for authentication and communication
     */
    mobile: string;
    /**
     * Customer's date of birth used for identity verification
     */
    dob: string;
    /**
     * Customer's Permanent Account Number for tax identification and regulatory compliance
     */
    pan?: string;
    /**
     * Customer's email address for digital communication and notifications
     */
    email?: string;
};

