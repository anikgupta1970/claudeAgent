/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountRef } from './AccountRef.js';
import type { FDInterestPaymentOption } from './FDInterestPaymentOption.js';
/**
 * Represents the Interest Payment Instruction.
 */
export type InterestPaymentInstruction = {
    option: FDInterestPaymentOption;
    /**
     * This field is deprecated. Use payoutAccount input attribute instead. Account number where interest payments should be credited (if different from debit account)
     * @deprecated
     */
    payoutAccountId?: string;
    /**
     * Reference to the savings account where interest payments should be credited. If this input is not provided then debitAccountId will be used for this purpose.
     */
    payoutAccount?: AccountRef;
};

