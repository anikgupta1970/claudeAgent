/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateIndividualCustomerInstructionResult } from './CreateIndividualCustomerInstructionResult.js';
import type { EnableInternetBankingInstructionResult } from './EnableInternetBankingInstructionResult.js';
import type { EnablePhoneBankingInstructionResult } from './EnablePhoneBankingInstructionResult.js';
import type { HttpProblem } from './HttpProblem.js';
import type { InstructionStatus } from './InstructionStatus.js';
import type { InstructionType } from './InstructionType.js';
import type { IssueDebitCardInstructionResult } from './IssueDebitCardInstructionResult.js';
import type { OpenFDAccountInstructionResult } from './OpenFDAccountInstructionResult.js';
import type { OpenSavingAccountInstructionResult } from './OpenSavingAccountInstructionResult.js';
import type { SetupInstaAlertInstructionResult } from './SetupInstaAlertInstructionResult.js';
import type { SetupSweepOutInstructionResult } from './SetupSweepOutInstructionResult.js';
/**
 * Application form instruction results
 */
export type InstructionResult = (CreateIndividualCustomerInstructionResult | OpenFDAccountInstructionResult | OpenSavingAccountInstructionResult | SetupSweepOutInstructionResult | SetupInstaAlertInstructionResult | EnableInternetBankingInstructionResult | EnablePhoneBankingInstructionResult | IssueDebitCardInstructionResult | {
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
});

