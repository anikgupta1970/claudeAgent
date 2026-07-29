/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonName } from './PersonName.js';
import type { TaxIdentificationType } from './TaxIdentificationType.js';
/**
 * PAN card identification details
 */
export type PanIdentification = {
    /**
     * Identification type
     */
    type: TaxIdentificationType;
    /**
     * Permanent Account Number.<br>This field is required if type is "pan" ; otherwise, it will be ignored even if provided.
     */
    pan: string;
    /**
     * Name as per PAN
     */
    name?: PersonName;
};

