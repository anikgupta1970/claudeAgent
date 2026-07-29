/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Allocation } from './Allocation.js';
import type { ApplicationProcessingStatusType } from './ApplicationProcessingStatusType.js';
import type { InstructionResult } from './InstructionResult.js';
/**
 * Application processing status
 */
export type ApplicationProcessingStatus = {
    /**
     * Unique identifier for the submitted application
     */
    applicationId?: string;
    status?: ApplicationProcessingStatusType;
    /**
     * Account allocation details for the account opening instructions submitted in the application form
     */
    allocations?: Array<Allocation>;
    instructionResults?: Array<InstructionResult>;
};

