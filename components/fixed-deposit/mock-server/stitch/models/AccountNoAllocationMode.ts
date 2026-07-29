/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Mode of account number allocation.
 * - generated: System generates the account number.
 * - preferred: Customer specifies full/part of the account number
 * - predefined: Predefined account number associated with the application form or card
 *
 */
export enum AccountNoAllocationMode {
    GENERATED = 'generated',
    PREFERRED = 'preferred',
    PREDEFINED = 'predefined',
}
