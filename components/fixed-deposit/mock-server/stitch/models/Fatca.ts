/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResidentialStatus } from './ResidentialStatus.js';
import type { TaxResidency } from './TaxResidency.js';
/**
 * FATCA (Foreign Account Tax Compliance Act) related information
 */
export type Fatca = {
    /**
     * Residential status for tax and regulatory compliance
     */
    residentialStatus: ResidentialStatus;
    /**
     * Tax residency information for one or more countries.<br>This field is required if the customer is foreign tax resident ; otherwise, it will be ignored even if provided.
     */
    taxResidencies?: Array<TaxResidency>;
    /**
     * Country of birth of the customer in ISO 3166-1 alpha-2 country code.<br>This field is required if tax resident is outside India or Nationality is other than India ; otherwise, it will be ignored even if provided.
     */
    countryOfBirth?: string;
    /**
     * City of birth of the customer.<br>This field is required if tax resident is outside India or Nationality is other than India ; otherwise, it will be ignored even if provided.
     */
    cityOfBirth?: string;
};

