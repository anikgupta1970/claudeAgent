/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountHolderRef } from './AccountHolderRef.js';
import type { AccountRef } from './AccountRef.js';
import type { InstructionType } from './InstructionType.js';
/**
 * Instruction to enable phone banking for the account
 */
export type EnablePhoneBankingInstruction = {
    /**
     * The Instruction to enable phone banking for the account
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Reference to the savings account for which phone banking is to be enabled.
     */
    account: AccountRef;
    /**
     * Reference to the holder of the account for which phone banking is to be enabled.
     */
    holder: AccountHolderRef;
};

