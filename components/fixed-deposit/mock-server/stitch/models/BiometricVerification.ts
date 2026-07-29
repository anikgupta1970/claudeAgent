/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BiometricVerificationType } from './BiometricVerificationType.js';
import type { KYCVerificationMode } from './KYCVerificationMode.js';
/**
 * Biometric KYC verification details
 */
export type BiometricVerification = {
    /**
     * Verification mode
     */
    mode: KYCVerificationMode;
    /**
     * Biometric Verification type
     */
    biometricType: BiometricVerificationType;
    /**
     * Aadhaar reference number received after successful KYC verification.
     */
    aadhaarReferenceNumber: string;
    /**
     * Unique request reference number for the Aadhaar based e-kyc.
     */
    referenceNumber?: string;
};

