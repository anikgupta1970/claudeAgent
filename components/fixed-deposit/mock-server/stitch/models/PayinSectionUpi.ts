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
 * Payment section for UPI (Unified Payments Interface) transactions
 */
export type PayinSectionUpi = {
    /**
     * Payment method specification indicating this section processes UPI (Unified Payments Interface) transactions for account funding
     */
    method: PaymentMethod;
    /**
     * A unique identifier number assigned to a bank account. Partially masked to protect information
     */
    accountId: string;
    /**
     * UPI transaction amount for account funding, including currency specification for instant digital payments
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
     * Payment gateway infrastructure used to process this UPI transaction with security and reliability
     */
    pg: PaymentGateway;
    /**
     * Type of section in the application form
     */
    section: SectionType;
    /**
     * Current processing status of this UPI payment transaction
     */
    status: PaymentStatus;
    /**
     * Virtual payment address for UPI Transactions. Mandatory in case of Payment Mode as UPI
     */
    vpa: string;
};

