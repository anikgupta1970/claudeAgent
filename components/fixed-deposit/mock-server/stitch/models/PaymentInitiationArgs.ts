/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalBankAccount } from './ExternalBankAccount.js';
import type { Money } from './Money.js';
import type { PaymentMethod } from './PaymentMethod.js';
import type { UPI } from './UPI.js';
/**
 * Arguments required to initiate a payment
 */
export type PaymentInitiationArgs = {
    /**
     * A unique identifier assigned to customers by the bank.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters
     */
    customerId: string;
    /**
     * Reference number passed by client application to uniquely identify the payment transaction
     */
    clientReferenceNumber: string;
    /**
     * Client application URL which is used to send the successful transaction response
     */
    clientSuccessUrl: string;
    /**
     * Client application URL which is used to send the failed transaction response
     */
    clientFailureUrl: string;
    /**
     * Method of payment. Supported values are net_banking or upi
     */
    method: PaymentMethod;
    /**
     * Payment mode-specific details
     */
    instrument?: (ExternalBankAccount | UPI);
    /**
     * Payment amount
     */
    amount: Money;
};

