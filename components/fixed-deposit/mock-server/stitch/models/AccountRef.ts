/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountRefType } from './AccountRefType.js';
/**
 * Account reference using either the account ID or a reference from the instruction.
 */
export type AccountRef = {
    /**
     * Reference method used to identify the account (Account ID or reference key)
     */
    type: AccountRefType;
    /**
     * A unique identifier assigned to account by the bank. <br> This field is required if type is 'account_id' ; otherwise, it will be ignored even if provided.
     */
    accountId?: string;
    /**
     * Identifier of the form instruction with account details. <br> This field is required if type is 'ref' ; otherwise, it will be ignored even if provided. <br> The value in this field must correspond to exactly one instruction id whose type is either open_sa or open_fd.
     */
    ref?: string;
};

