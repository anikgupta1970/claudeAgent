/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmploymentType } from './EmploymentType.js';
/**
 * Self-employed professional details
 */
export type SelfEmployedProfessional = {
    /**
     * Employment type
     */
    type: EmploymentType;
    /**
     * Professional designation.<br>The allowed values have to comply with 'profession' in '/fi/enums'.<br>However, other values can also be specified if they do not match the predefined ones.
     */
    profession: string;
};

