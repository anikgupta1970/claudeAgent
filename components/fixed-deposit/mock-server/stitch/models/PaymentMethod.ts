/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Method of payment used for account funding
 * - cash: Payment by cash.
 * - cheque: Payment by cheque.
 * - upi: Payment via Unified Payments Interface (UPI).
 * - transfer: Payment by bank transfer.
 * - net_banking: Payment via net banking.
 *
 */
export enum PaymentMethod {
    CASH = 'cash',
    CHEQUE = 'cheque',
    UPI = 'upi',
    TRANSFER = 'transfer',
    NET_BANKING = 'net_banking',
}
