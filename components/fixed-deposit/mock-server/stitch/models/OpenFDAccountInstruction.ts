/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountOpenMode } from './AccountOpenMode.js';
import type { AccountOperatedBy } from './AccountOperatedBy.js';
import type { AccountRef } from './AccountRef.js';
import type { GuardianRef } from './GuardianRef.js';
import type { InstructionType } from './InstructionType.js';
import type { InterestPaymentInstruction } from './InterestPaymentInstruction.js';
import type { JointHolder } from './JointHolder.js';
import type { MaturityInstruction } from './MaturityInstruction.js';
import type { MinorCustomerRef } from './MinorCustomerRef.js';
import type { Money } from './Money.js';
import type { Nomination1 } from './Nomination1.js';
import type { SoloCustomerRef } from './SoloCustomerRef.js';
/**
 * The Instruction to Open a Fixed Deposit
 */
export type OpenFDAccountInstruction = {
    /**
     * The Instruction to Open a Fixed Deposit
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Specific variant of the Fixed Deposit product being opened, determining features and terms applicable to this Fixed Deposit.<br>The allowed values will have to comply with 'products' in '/fi/products'.
     */
    productVariant: string;
    /**
     * Principal amount to be deposited in this Fixed Deposit account, specified with currency details
     */
    depositAmount: Money;
    /**
     * This indicates the period in xsd:duration format
     */
    tenure: string;
    /**
     * Customer's specified instructions for interest payout frequency and destination account during the FD tenure
     */
    interestPaymentInstruction: InterestPaymentInstruction;
    /**
     * Customer's instructions for handling the principal and final interest when the Fixed Deposit reaches maturity
     */
    maturityInstruction: MaturityInstruction;
    /**
     * Beneficiary nomination details for this Fixed Deposit
     */
    nomination?: Nomination1;
    /**
     * This field is deprecated. Use debitAccount input attribute instead. Customer's existing Account number in the bank from which the FD deposit amount will be debited.
     * @deprecated
     */
    debitAccountId: string;
    /**
     * Customer's existing Account number in the bank from which the FD deposit amount will be debited.
     */
    debitAccount?: AccountRef;
    /**
     * The unique code representing the specific branch of the banking.<br>The allowed values will have to comply with 'branches' in '/fi/branches'.
     */
    branchCode: string;
    /**
     * Contains details about the joint holders for a Fixed Deposit.<br>This field is required when openMode is "joint" ; otherwise, it will be ignored even if provided.
     */
    holders?: Array<JointHolder>;
    /**
     * Contains details about the individual holder for a Fixed Deposit.<br>This field is required when openMode is "solo" ; otherwise, it will be ignored even if provided.
     */
    holder?: SoloCustomerRef;
    /**
     * Contains details about the minor holder for a Fixed Deposit.<br>This field is required when openMode is "minor" ; otherwise, it will be ignored even if provided.
     */
    minor?: MinorCustomerRef;
    /**
     * Contains details about the guardian holder for a Fixed Deposit.<br>This field is required when openMode is "minor" ; otherwise, it will be ignored even if provided.
     */
    guardian?: GuardianRef;
    /**
     * Specifies how a jointly held Fixed Deposit can be operated.<br>This field is required when openMode is 'joint' ; otherwise, it will be ignored even if provided.
     */
    operatedBy?: AccountOperatedBy;
    /**
     * Mode through which the Fixed Deposit is being opened.
     */
    openMode: AccountOpenMode;
};

