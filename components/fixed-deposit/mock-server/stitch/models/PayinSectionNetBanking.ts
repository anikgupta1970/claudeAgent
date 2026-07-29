/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money.js';
import type { PaymentGateway } from './PaymentGateway.js';
import type { PaymentMethod } from './PaymentMethod.js';
import type { PaymentStatus } from './PaymentStatus.js';
import type { SectionType } from './SectionType.js';
/**
 * Payin Section NetBanking
 */
export type PayinSectionNetBanking = {
    /**
     * Payment method specification indicating this section processes net banking transfers for account funding
     */
    method: PaymentMethod;
    /**
     * A unique identifier number assigned to a bank account. Partially masked to protect information
     */
    accountId: string;
    /**
     * Net banking transfer amount for account funding, including specific currency denomination
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
     * It indicates the date on which the payment was made to fund the account
     */
    paymentDate: string;
    /**
     * It specifies the unique identifier assigned to a payment transaction
     */
    paymentTxnId: string;
    /**
     * Payment gateway configuration used to process this net banking transaction securely
     */
    pg: PaymentGateway;
    /**
     * Section type classification for this net banking payment within the application form structure
     */
    section: SectionType;
    /**
     * Current processing status of this net banking transfer transaction
     */
    status: PaymentStatus;
};

