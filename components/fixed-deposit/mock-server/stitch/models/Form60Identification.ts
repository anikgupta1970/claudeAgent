/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Income1 } from './Income1.js';
import type { PanApplication } from './PanApplication.js';
import type { TaxIdentificationType } from './TaxIdentificationType.js';
/**
 * Form 60 declaration for customers without PAN card
 */
export type Form60Identification = {
    /**
     * Tax Identification type
     */
    type: TaxIdentificationType;
    /**
     * PAN application details if customer has applied for PAN.<br>This field is required if type is "form60" ; otherwise, it will be ignored even if provided.
     */
    panApplication?: PanApplication;
    /**
     * Income information for tax assessment.<br>This field is required if type is "form60" ; otherwise, it will be ignored even if provided.
     */
    income?: Income1;
};

