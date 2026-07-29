/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountHolderRef } from './AccountHolderRef.js';
/**
 * Document associated with a specific applicant/customer in the application form
 */
export type AccountHolderDocument = {
    /**
     * Path where file is stored in the storage system.
     */
    filePath: string;
    /**
     * Type of the document (e.g., PAN_CARD, AADHAAR_CARD, PASSPORT, PHOTO, SIGNATURE.).<br> The allowed values will have to comply with the 'documentType' defined in '/fi/enums'.
     */
    documentType: string;
    /**
     * Reference to the account holder to which this document belongs to.
     */
    accountHolder: AccountHolderRef;
};

