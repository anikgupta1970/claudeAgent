/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VerificationStatus } from './VerificationStatus.js';
export type UpiVpaVerificationResult = {
    /**
     * Status of the UPI VPA verification process
     */
    status: VerificationStatus;
    /**
     * An identifier specifying the reason for failure. In this case, it indicates a name mismatch during VPA. This is optional response field.
     */
    reason?: string;
};

