/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Disability } from './Disability.js';
import type { Education } from './Education.js';
import type { Family } from './Family.js';
/**
 * Demographic information about the individual customer
 */
export type Demographics = {
    /**
     * Date of birth of the customer in ISO 8601 format (YYYY-MM-DD)
     */
    dob: string;
    /**
     * Gender of the customer.<br>The allowed values will have to comply with 'gender' defined in '/fi/enums'
     */
    gender: string;
    /**
     * Marital status of the customer.<br>The allowed values will have to comply with the 'maritalStatus' defined in '/fi/enums'.
     */
    maritalStatus: string;
    /**
     * Family information including mother's maiden name, father's name, and spouse's name of the customer.
     */
    family: Family;
    /**
     * Residence type of the customer.<br>The allowed values will have to comply with the 'residenceType' defined in '/fi/enums'.<br>However, other values can also be specified if they do not match the predefined ones.
     */
    residenceType: string;
    /**
     * Nationality of the customer in ISO 3166-1 alpha-2 country code.
     */
    nationality: string;
    /**
     * Disability information of the customer, if applicable
     */
    disability?: Disability;
    /**
     * Caste of the customer.<br>The allowed values will have to comply with the 'caste' defined in '/fi/enums'.
     */
    caste?: string;
    /**
     * Name of the minority community.<br>The allowed values will have to comply with the 'minorityCommunity' defined in '/fi/enums'.
     */
    minorityCommunity?: string;
    /**
     * Education details of the customer.
     */
    education?: Education;
    /**
     * Occupation of the customer.<br>The allowed values will have to comply with the 'occupation' defined in '/fi/enums'.<br>However, other values can also be specified if they do not match the predefined ones.
     */
    occupation: string;
};

