/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountHolderResult } from './AccountHolderResult.js';
import type { HttpProblem } from './HttpProblem.js';
import type { InstructionStatus } from './InstructionStatus.js';
import type { InstructionType } from './InstructionType.js';
/**
 * Results for OpenSavingAccountInstruction
 */
export type OpenSavingAccountInstructionResult = {
    /**
     * Unique identifier for the instruction
     */
    instructionId?: string;
    instructionType?: InstructionType;
    status?: InstructionStatus;
    /**
     * Problem details in case of any failure while execution of the instruction
     */
    problem?: HttpProblem;
    /**
     * Unique identifier for the new account
     */
    accountNo?: string;
    /**
     * List of account holders
     */
    holders?: Array<AccountHolderResult>;
};

