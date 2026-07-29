/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonName } from './PersonName.js';
/**
 * Business Delegation Authority (BDA) information
 */
export type Bda = {
    /**
     * Name of the BDA
     */
    name?: PersonName;
    /**
     * Code of BDA
     */
    code: string;
    /**
     * Date of BDA approval in ISO 8601 format (YYYY-MM-DD)
     */
    approvalDate: string;
};

