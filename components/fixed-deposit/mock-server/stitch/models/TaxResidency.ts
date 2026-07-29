/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaxAddressLocationType } from './TaxAddressLocationType.js';
import type { TaxAddressType } from './TaxAddressType.js';
/**
 * Tax residency and birth information for FATCA compliance
 */
export type TaxResidency = {
    /**
     * Country of tax residency (ISO 3166-1 alpha-2 code)
     */
    countryOfTaxResidency: string;
    /**
     * Type of tax identification
     */
    taxIdentificationType: string;
    /**
     * Tax identification number
     */
    taxIdentificationNumber: string;
    /**
     * Tax address type
     */
    taxAddressType?: TaxAddressType;
    /**
     * Tax address location type
     */
    taxAddressLocationType?: TaxAddressLocationType;
};

