/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountNoAllocation } from './AccountNoAllocation.js';
import type { AccountOpenMode } from './AccountOpenMode.js';
import type { AccountOperatedBy } from './AccountOperatedBy.js';
import type { GuardianRef } from './GuardianRef.js';
import type { InstructionType } from './InstructionType.js';
import type { MinorCustomerRef } from './MinorCustomerRef.js';
import type { Money } from './Money.js';
import type { Nomination1 } from './Nomination1.js';
import type { SavingsJointHolder } from './SavingsJointHolder.js';
import type { SavingsSoloCustomerRef } from './SavingsSoloCustomerRef.js';
/**
 * The Instruction to open a Savings Account
 */
export type OpenSavingAccountInstruction = {
    /**
     * The Instruction to open a Savings Account.
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Mode through which the savings account is being opened
     */
    openMode: AccountOpenMode;
    /**
     * Contains details about the individual holder for a Savings account.<br>This field is required when openMode is "solo" ; otherwise, it will be ignored even if provided.
     */
    holder?: SavingsSoloCustomerRef;
    /**
     * Contains details about the joint holders for a Savings Account.<br>This field is required when openMode is "joint" ; otherwise, it will be ignored even if provided.
     */
    holders?: Array<SavingsJointHolder>;
    /**
     * Contains details about the minor holder for a Savings Account.<br>This field is required when openMode is "minor" ; otherwise, it will be ignored even if provided.
     */
    minor?: MinorCustomerRef;
    /**
     * Contains details about the guardian holder for a Savings Account.<br>This field is required when openMode is "minor" ; otherwise, it will be ignored even if provided.
     */
    guardian?: GuardianRef;
    /**
     * Specifies how a jointly held Savings Account can be operated.<br>This field is required when openMode is "joint" ; otherwise, it will be ignored even if provided.
     */
    operatedBy?: AccountOperatedBy;
    /**
     * Specific variant of the Savings Account product being opened, determining the features, benefits, and terms of this account.<br>The allowed values will have to comply with 'products' in '/fi/products'.
     */
    productVariant: string;
    /**
     * The unique code representing the specific branch of the bank where account will be opened.<br>The allowed values will have to comply with 'branches' in '/fi/branches'.
     */
    branchCode: string;
    /**
     * Title of the account
     */
    accountTitle?: string;
    /**
     * Account number allocation details
     */
    allocation: AccountNoAllocation;
    /**
     * Beneficiary nomination details for this account
     */
    nomination?: Nomination1;
    /**
     * Initial amount deposit to the account, specified with currency details
     */
    initialDepositAmount?: Money;
    /**
     * Consent to link Savings Account to Aadhaar card
     */
    linkAccountToAadhar?: boolean;
};

