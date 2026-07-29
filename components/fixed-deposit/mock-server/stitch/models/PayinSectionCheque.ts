/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money.js';
import type { PaymentMethod } from './PaymentMethod.js';
import type { PaymentStatus } from './PaymentStatus.js';
import type { SectionType } from './SectionType.js';
/**
 * Payment section for cheque deposit transactions
 */
export type PayinSectionCheque = {
    /**
     * Payment method specification indicating this section processes cheque deposits for account funding
     */
    method: PaymentMethod;
    /**
     * A unique identifier number assigned to a bank account. Partially masked to protect information
     */
    accountId: string;
    /**
     * Cheque amount being deposited for account funding, specified with currency details
     */
    amount: Money;
    /**
     * The date when the cheque becomes valid for processing and can be presented for payment in ISO 8601 format (YYYY-MM-DD). Mandatory if payment is by cheque
     */
    chequeDate: string;
    /**
     * Specifies the unique numeric identifier printed on a cheque used for tracking and processing cheque-based transactions. Mandatory if payment is by cheque
     */
    chequeNo: string;
    /**
     * The date on which the cheque is submitted to the bank for processing in ISO 8601 format (YYYY-MM-DD). Mandatory if payment is by cheque
     */
    depositDate: string;
    /**
     * A unique identifier assigned to each section
     */
    id: string;
    /**
     * A unique 11-character alphanumeric code used to identify specific bank branches
     */
    ifsc: string;
    /**
     * It indicates the date on which the payment was made to fund the account
     */
    paymentDate: string;
    /**
     * It specifies the unique identifier assigned to a payment transaction
     */
    paymentTxnId: string;
    /**
     * Section type classification for this cheque payment within the application form structure
     */
    section: SectionType;
    /**
     * Current processing status of this cheque deposit transaction
     */
    status: PaymentStatus;
};

