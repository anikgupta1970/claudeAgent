/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KYCVerificationMode } from './KYCVerificationMode.js';
/**
 * Aadhaar OTP based KYC verification details
 */
export type AadhaarOTPVerification = {
    /**
     * Verification mode
     */
    mode: KYCVerificationMode;
    /**
     * Aadhaar reference number received after successful KYC verification.
     */
    aadhaarReferenceNumber: string;
    /**
     * Unique request reference number for the Aadhaar based e-kyc.
     */
    referenceNumber?: string;
};

