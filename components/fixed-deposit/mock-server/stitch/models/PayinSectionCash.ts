/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money.js';
import type { PaymentMethod } from './PaymentMethod.js';
import type { PaymentStatus } from './PaymentStatus.js';
import type { SectionType } from './SectionType.js';
/**
 * Payment section for cash deposit transactions
 */
export type PayinSectionCash = {
    /**
     * Payment method specification indicating this section processes cash deposits for account funding
     */
    method: PaymentMethod;
    /**
     * Cash amount being deposited for this payment section, including currency denomination
     */
    amount: Money;
    /**
     * A unique identifier assigned to each section
     */
    id: string;
    /**
     * It indicates the date on which the payment was made to fund in ISO 8601 format (YYYY-MM-DD) the account.
     */
    paymentDate: string;
    /**
     * It specifies the unique identifier assigned to a payment transaction
     */
    paymentTxnId: string;
    /**
     * Section type classification for this cash payment within the application form structure
     */
    section: SectionType;
    /**
     * Current processing status of this cash deposit transaction
     */
    status: PaymentStatus;
};

