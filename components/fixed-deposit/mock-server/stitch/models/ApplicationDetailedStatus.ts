/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationDetailedStatusType } from './ApplicationDetailedStatusType.js';
import type { HttpProblem } from './HttpProblem.js';
import type { InstructionResult } from './InstructionResult.js';
/**
 * Detailed application status including instruction results
 */
export type ApplicationDetailedStatus = {
    /**
     * Unique identifier for the submitted application
     */
    applicationId?: string;
    status?: ApplicationDetailedStatusType;
    /**
     * Problem details in case of any failure e.g. scrutiny check failure
     */
    problem?: HttpProblem;
    /**
     * Instruction wise results. Also contains the failed instructions with respective problem details
     */
    instructionResults?: Array<InstructionResult>;
};

