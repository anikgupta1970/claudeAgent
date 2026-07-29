/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpProblem } from './HttpProblem.js';
import type { InstructionStatus } from './InstructionStatus.js';
import type { InstructionType } from './InstructionType.js';
import type { Money } from './Money.js';
/**
 * Results for OpenFDAccountInstruction
 */
export type OpenFDAccountInstructionResult = {
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
     * Rate of interest for new fixed deposit
     */
    rateOfInterest?: number;
    /**
     * Maturity amout for new fixed deposit
     */
    maturityAmount?: Money;
};

