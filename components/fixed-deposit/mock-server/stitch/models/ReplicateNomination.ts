/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NominationRefType } from './NominationRefType.js';
/**
 * Nomination is to be replicated from an account
 */
export type ReplicateNomination = {
    /**
     * Nomination type indicator specifying that this nomination should be copied from another existing account
     */
    type: NominationRefType;
    /**
     * A unique identifier of the account from which nomination is to be replicated
     */
    accountId?: string;
    /**
     * Indicates if the nominee name to be displayed on passbook, account statement,etc.
     */
    displayNomineeOnDocuments?: boolean;
};

