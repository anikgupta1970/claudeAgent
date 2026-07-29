/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountHolderRef } from './AccountHolderRef.js';
import type { AccountRef } from './AccountRef.js';
import type { DebitCardRequest } from './DebitCardRequest.js';
import type { InstructionType } from './InstructionType.js';
/**
 * Instruction to issue a debit card for a savings account to the account holder
 */
export type IssueDebitCardInstruction = {
    /**
     * The Instruction type to issue a debit card for the account
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Reference to the savings account for which debit card is to be issued.
     */
    account: AccountRef;
    /**
     * Reference to the holder of the account to whom debit card is to be issued.
     */
    holder: AccountHolderRef;
    /**
     * Debit card request details. It can either be New card request or linkage to existing debit card
     */
    request: DebitCardRequest;
};

