/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NominationMethod } from './NominationMethod.js';
import type { NominationRefType } from './NominationRefType.js';
import type { Nominee1 } from './Nominee1.js';
/**
 * Nomination details provided directly within the instruction.<br>This approach is recommended when each instruction has different nominees.
 */
export type InlineNomination = {
    type: NominationRefType;
    method: NominationMethod;
    /**
     * List of nominees for the account
     */
    nominees: Array<Nominee1>;
    /**
     * Indicates if the nominee name to be displated on passbook, account statement,etc.
     */
    displayNomineeOnDocuments?: boolean;
};

