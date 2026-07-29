/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountNoAllocationMode } from './AccountNoAllocationMode.js';
/**
 * Pre-defined account number allocation
 */
export type PredefinedAccountIdAllocation = {
    /**
     * Indicates the mode used to allocate the account number
     */
    mode: AccountNoAllocationMode;
    /**
     * Pre-defined account number. e.g. printed on physical application form.<br>This field is required if mode is "predefined".
     */
    accountId: string;
    /**
     * Identifier for the kit that has predefined account number.<br>This field is required if mode is "predefined" ; otherwise, it will be ignored even if provided.
     */
    kitId: string;
};

