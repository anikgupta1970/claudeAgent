/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VerificationStatus } from './VerificationStatus.js';
/**
 * Result of bank account verification process
 */
export type BankAccountVerificationResult = {
    /**
     * Status of the bank account verification process
     */
    status: VerificationStatus;
    /**
     * Reason for the verification status, especially if verification failed. This is optional response field.
     */
    reason?: string;
};

