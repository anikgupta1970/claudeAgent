/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FDInterestPaymentOption } from './FDInterestPaymentOption.js';
import type { MaturityInstruction } from './MaturityInstruction.js';
import type { Money } from './Money.js';
/**
 * Input parameters for Fixed Deposit maturity calculation
 */
export type CalculationArgs = {
    /**
     * A unique identifier assigned to customers by the bank.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters
     */
    customerId: string;
    /**
     * Specifies the type of the product offered by the bank for Fixed Deposit.<br>The allowed values will have to comply with products in '/fi/products'.
     */
    productVariant: string;
    /**
     * Principal amount that the customer wants to deposit in the Fixed Deposit, including currency denomination
     */
    depositAmount: Money;
    /**
     * This indicates the period in xsd:duration format
     */
    tenure: string;
    /**
     * Customer's preference for how interest should be paid out during the FD tenure.
     */
    interestPaymentOption: FDInterestPaymentOption;
    /**
     * Customer's instructions for handling the principal and final interest when the Fixed Deposit reaches maturity
     */
    maturityInstruction: MaturityInstruction;
};

