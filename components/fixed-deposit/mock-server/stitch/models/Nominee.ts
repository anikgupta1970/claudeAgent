/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NomineesGuardian } from './NomineesGuardian.js';
import type { PostalAddress } from './PostalAddress.js';
/**
 * Nominee information with contact details and share percentage
 */
export type Nominee = {
    /**
     * It defines the sequence in which nominees are listed.
     */
    order: number;
    /**
     * Full name of the nominee
     */
    name: string;
    /**
     * Specifies the percentage of the benefit or entitlement allocated to a nominee.
     * For simultaneous nominees: The total share percentage across all nominees must equal 100%.
     * For successive nominees: Each nominee must have a share percentage of 100%, as they receive the full benefit in succession.
     *
     */
    sharePct?: number;
    /**
     * Date of birth of the nominee in ISO 8601 format (YYYY-MM-DD)
     */
    dob?: string;
    /**
     * Mobile number of the nominee in E.164 format.
     */
    mobile?: string;
    /**
     * Relationship of a person with Applicant.
     * The allowed values have to comply with 'relationship' in '/fi/enums/{name}/choices'.
     *
     */
    relationship?: string;
    /**
     * Address information of the nominee
     */
    address: PostalAddress;
    /**
     * Guardian details specific to this nominee, required when the nominee is under 18 years of age
     */
    guardian?: NomineesGuardian;
};

