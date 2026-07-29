/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmploymentType } from './EmploymentType.js';
/**
 * Salaried employment details
 */
export type Salaried = {
    /**
     * Employment type
     */
    type: EmploymentType;
    /**
     * Type of employer.<br>The allowed values will have to comply with the 'employerType' defined in '/fi/enums'.<br>However, other values can also be specified if they do not match the predefined ones.
     */
    employerType: string;
    /**
     * Code of the employer
     */
    employerCode?: string;
    /**
     * Indicates whether the customer is employee of the financial institution
     */
    isStaff?: boolean;
    /**
     * Employee code of the employee
     */
    employeeCode?: string;
};

