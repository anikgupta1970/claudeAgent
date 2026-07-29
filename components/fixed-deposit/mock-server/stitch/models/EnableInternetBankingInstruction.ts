/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountHolderRef } from './AccountHolderRef.js';
import type { AccountRef } from './AccountRef.js';
import type { InstructionType } from './InstructionType.js';
/**
 * Instruction to enable internet banking for the account
 */
export type EnableInternetBankingInstruction = {
    /**
     * The Instruction to enable internet banking for an account.
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Reference to the account for which internet banking is to be enabled.
     */
    account: AccountRef;
    /**
     * Reference to the holder of the account for which internet banking is to be enabled.
     */
    holder: AccountHolderRef;
};

