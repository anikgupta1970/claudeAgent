/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmploymentType } from './EmploymentType.js';
import type { Money } from './Money.js';
/**
 * Self-employment details
 */
export type SelfEmployed = {
    /**
     * Employment type
     */
    type: EmploymentType;
    /**
     * Duration of self-employment in ISO 8601 period format
     */
    since: string;
    /**
     * Annual turn over
     */
    annualTurnOver: Money;
    /**
     * Nature of business.<br>The allowed values have to comply with 'natureOfBusiness' in '/fi/enums'.<br>However, other values can also be specified if they do not match the predefined ones.
     */
    natureOfBusiness: string;
    /**
     * Date of business incorporation in ISO 8601 format (YYYY-MM-DD)
     */
    incorporationDate: string;
    /**
     * Type of business firm.<br>The allowed values have to comply with 'typeOfFirm' in '/fi/enums'.<br>However, other values can also be specified if they do not match the predefined ones.
     */
    typeOfFirm: string;
};

