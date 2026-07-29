/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money.js';
/**
 * Income breakdown for tax assessment.
 */
export type Income1 = {
    /**
     * Agricultural income amount in INR
     */
    agricultural: Money;
    /**
     * Non-agricultural income amount in INR
     */
    nonAgricultural: Money;
};

