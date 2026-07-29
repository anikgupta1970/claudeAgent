/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Arguments required to fetch payment status.
 */
export type PaymentStatusArgs = {
    /**
     * Client reference number that was passed at the time of payment initiation. Either clientReferenceNumber or paymentTxnId can be passed to fetch the status. clientReferenceNumber will be considered if both values are passed.
     */
    clientReferenceNumber?: string | null;
    /**
     * paymentTxnId received in payment initiation response. Either clientReferenceNumber or paymentTxnId can be passed to fetch the status. clientReferenceNumber will be considered if both values are passed.
     */
    paymentTxnId?: string | null;
};

