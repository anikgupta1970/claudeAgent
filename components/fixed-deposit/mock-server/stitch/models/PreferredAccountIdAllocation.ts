/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountNoAllocationMode } from './AccountNoAllocationMode.js';
/**
 * Preferred account number allocation
 */
export type PreferredAccountIdAllocation = {
    /**
     * Indicates the mode used to allocate the account number
     */
    mode: AccountNoAllocationMode;
    /**
     * Preferred account number specified by the customer.<br>It can be a complete account number or partial number where the system generates the remaining digits.<br>This field is required if mode is "preferred".
     */
    accountId: string;
};

