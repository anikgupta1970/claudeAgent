/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountHolderRef } from './AccountHolderRef.js';
import type { AccountRef } from './AccountRef.js';
import type { InstructionType } from './InstructionType.js';
/**
 * Instruction to setup insta-alerts for a savings account
 */
export type SetupInstaAlertInstruction = {
    /**
     * The Instruction type to enable insta-alerts for the account
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Reference to the savings account for which insta-alerts are to be setup.
     */
    account: AccountRef;
    /**
     * Reference to the holder of the account for which insta-alerts are is to be setup.
     */
    holder: AccountHolderRef;
};

