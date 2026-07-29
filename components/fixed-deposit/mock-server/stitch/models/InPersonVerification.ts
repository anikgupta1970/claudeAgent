/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KYCVerificationMode } from './KYCVerificationMode.js';
import type { OVDVerification } from './OVDVerification.js';
/**
 * In-person KYC verification details
 */
export type InPersonVerification = {
    /**
     * Verification mode
     */
    mode: KYCVerificationMode;
    /**
     * List of OVDs verified as part of in-person KYC verification process
     */
    ovdVerifications?: Array<OVDVerification>;
};

