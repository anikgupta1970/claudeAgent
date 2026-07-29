/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OVDType } from './OVDType.js';
import type { OVDVerificationCategory } from './OVDVerificationCategory.js';
/**
 * Voter id verification details
 */
export type VoterIdVerification = {
    /**
     * Type of Officially Valid Document (OVD)
     */
    ovdType: OVDType;
    /**
     * Category of verifications done using Officially Valid Documents (OVD)
     */
    verificationCategory: OVDVerificationCategory;
    /**
     * Voter id number
     */
    voterIdNumber: string;
    /**
     * Unique reference number for on-line voter id verification, if any
     */
    referenceNumber?: string;
};

