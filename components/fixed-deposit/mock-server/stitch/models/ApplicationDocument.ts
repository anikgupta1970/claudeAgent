/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountRef } from './AccountRef.js';
/**
 * Additional document attached to the application form for various purposes
 */
export type ApplicationDocument = {
    /**
     * Path where file is stored in the storage system.
     */
    filePath: string;
    /**
     * Type of the document (e.g., AOF). The allowed values will have to comply with the 'documentType' defined in '/fi/enums'.
     */
    documentType: string;
    /**
     * Reference of the specific account to which the document was uploaded against. e.g. Fatca document could be captured at account level
     */
    account?: AccountRef;
};

