/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Indicates the status of the payment made for the application
 * - deposited: The payment instrument was deposited - applies to cheque and cash
 * - unpaid: The payment hasn't been made yet
 * - paid: The payment was made - applies to transfer, upi and net banking
 * - initiated: The payment process has been started but is awaiting confirmation or completion
 *
 */
export enum PaymentStatus {
    DEPOSITED = 'deposited',
    UNPAID = 'unpaid',
    PAID = 'paid',
    INITIATED = 'initiated',
}
