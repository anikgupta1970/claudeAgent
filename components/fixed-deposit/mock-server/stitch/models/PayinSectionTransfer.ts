/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money.js';
import type { PaymentMethod } from './PaymentMethod.js';
import type { PaymentNetwork } from './PaymentNetwork.js';
import type { PaymentStatus } from './PaymentStatus.js';
import type { SectionType } from './SectionType.js';
/**
 * Payment section for bank transfer transactions
 */
export type PayinSectionTransfer = {
    /**
     * Payment method specification indicating this section processes bank-to-bank transfers for account funding
     */
    method: PaymentMethod;
    /**
     * A unique identifier number assigned to a bank account. Partially masked to protect information
     */
    accountId: string;
    /**
     * Bank transfer amount for account funding, specified with complete currency information
     */
    amount: Money;
    /**
     * A unique identifier assigned to each section
     */
    id: string;
    /**
     * A unique 11-character alphanumeric code used to identify specific bank branches
     */
    ifsc: string;
    /**
     * Interbank network protocol used for processing this transfer (RTGS, NEFT, IMPS, etc.)
     */
    network: PaymentNetwork;
    /**
     * It indicates the date on which the payment was made to fund the account
     */
    paymentDate?: string;
    /**
     * It specifies the unique identifier assigned to a payment transaction
     */
    paymentTxnId?: string;
    /**
     * Section type classification for this transfer payment within the application form structure
     */
    section: SectionType;
    /**
     * Current processing status of this bank transfer transaction
     */
    status: PaymentStatus;
};

