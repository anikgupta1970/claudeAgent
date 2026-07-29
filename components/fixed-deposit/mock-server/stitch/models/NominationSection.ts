/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NominationMethod } from './NominationMethod.js';
import type { Nominee1 } from './Nominee1.js';
import type { SectionType } from './SectionType.js';
/**
 * Nomination details provided as a reference within the section
 */
export type NominationSection = {
    /**
     * A unique identifier assigned to each section
     */
    id: string;
    /**
     * Section type classification for this section within the application form structure
     */
    section: SectionType;
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

