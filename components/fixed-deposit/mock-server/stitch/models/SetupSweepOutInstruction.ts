/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountRef } from './AccountRef.js';
import type { InstructionType } from './InstructionType.js';
import type { Money } from './Money.js';
import type { Nomination1 } from './Nomination1.js';
import type { ProcessingBatchType } from './ProcessingBatchType.js';
import type { SweepOutFrequencyType } from './SweepOutFrequencyType.js';
/**
 * Instruction to maintain sweep-out facility for a savings account
 */
export type SetupSweepOutInstruction = {
    /**
     * The Instruction type to setup sweep-out instruction for the account
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Reference to the savings account for which sweep out instruction is to be setup.
     */
    account: AccountRef;
    /**
     * Specific variant of the savings product associated with the account.<br>The allowed values will have to comply with products in '/fi/products'.
     */
    productVariant?: string;
    /**
     * Amount above which funds will be swept out.
     */
    thresholdAmount?: Money;
    /**
     * Minimum amount (inclusive of the value specified) for booking the fixed deposit.
     */
    minFixedDepositAmount?: Money;
    /**
     * Maximum amount (inclusive of the value specified) for booking the fixed deposit.
     */
    maxFixedDepositAmount?: Money;
    /**
     * Indicates when the instruction is to be executed. EOD/BOD.
     */
    processingBatchType?: ProcessingBatchType;
    /**
     * Frequency at which instructions will be executed
     */
    frequency?: SweepOutFrequencyType;
    /**
     * Beneficiary nomination details for this new fixed Deposit
     */
    nomination?: Nomination1;
};

