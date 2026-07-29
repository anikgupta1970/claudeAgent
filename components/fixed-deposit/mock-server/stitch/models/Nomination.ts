/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NominationMethod } from './NominationMethod.js';
import type { Nominee } from './Nominee.js';
/**
 * Account nomination details with nominees and distribution method
 */
export type Nomination = {
    /**
     * Nomination distribution method object defining how the account proceeds will be divided among nominees
     */
    method: NominationMethod;
    /**
     * List of current nominees associated with this account, including their details and share allocations
     */
    nominees: Array<Nominee>;
};

