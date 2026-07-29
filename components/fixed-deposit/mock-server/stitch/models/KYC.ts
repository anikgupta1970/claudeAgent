/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KYCStatus } from './KYCStatus.js';
import type { KYCVerification } from './KYCVerification.js';
/**
 * Customer's KYC details
 */
export type KYC = {
    /**
     * KYC Status
     */
    status: KYCStatus;
    /**
     * Data corresponding to the KYC verification mode.<br>This field is required if status is "successful" ; otherwise, it will be ignored even if provided.
     */
    verification?: KYCVerification;
    /**
     * Date of KYC completion. Mandatory if status is not pending.
     */
    completionDate?: string;
    /**
     * CKYC (Central Know Your Customer) reference number
     */
    ckycNumber?: string;
};

