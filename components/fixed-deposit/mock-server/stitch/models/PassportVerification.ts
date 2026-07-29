/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OVDType } from './OVDType.js';
import type { OVDVerificationCategory } from './OVDVerificationCategory.js';
/**
 * Passport verification details
 */
export type PassportVerification = {
    /**
     * Type of Officially Valid Document (OVD)
     */
    ovdType: OVDType;
    /**
     * Category of verifications done using Officially Valid Documents (OVD)
     */
    verificationCategory: OVDVerificationCategory;
    /**
     * Passport number
     */
    passportNumber: string;
    /**
     * Passport file number
     */
    fileNumber: string;
    /**
     * Country of issue in ISO 3166-1 alpha-2 country code.
     */
    countryOfIssue?: Record<string, any>;
    /**
     * Place of issue
     */
    placeOfIssue?: string;
    /**
     * Date of issue in ISO 8601 format (YYYY-MM-DD)
     */
    issueDate?: string;
    /**
     * Expiry date in ISO 8601 format (YYYY-MM-DD)
     */
    expiryDate?: string;
    /**
     * The date of birth as per passport document in ISO 8601 format (YYYY-MM-DD)
     */
    dob?: string;
    /**
     * Unique reference number for on-line passport verification, if any
     */
    referenceNumber?: string;
};

