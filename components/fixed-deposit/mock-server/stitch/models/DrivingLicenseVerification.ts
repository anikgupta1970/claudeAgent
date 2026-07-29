/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OVDType } from './OVDType.js';
import type { OVDVerificationCategory } from './OVDVerificationCategory.js';
/**
 * Driving License verification details
 */
export type DrivingLicenseVerification = {
    /**
     * Type of Officially Valid Document (OVD)
     */
    ovdType: OVDType;
    /**
     * Category of verifications done using Officially Valid Documents (OVD)
     */
    verificationCategory: OVDVerificationCategory;
    /**
     * Driving license number
     */
    licenseNumber: string;
    /**
     * Issue date of Driving License in ISO 8601 format (YYYY-MM-DD)
     */
    issueDate?: string;
    /**
     * Expiry date of Driving License in ISO 8601 format (YYYY-MM-DD)
     */
    expiryDate?: string;
    /**
     * The date of birth as per driving license in ISO 8601 format (YYYY-MM-DD)
     */
    dob?: string;
    /**
     * Unique reference number for on-line driving license verification, if any
     */
    referenceNumber?: string;
};

