/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Guardian } from './Guardian.js';
import type { PostalAddress } from './PostalAddress.js';
/**
 * Nominee information for account nomination
 */
export type Nominee1 = {
    /**
     * It defines the sequence in which nominees are listed.
     */
    order: number;
    /**
     * Complete residential address of the nominee, required for legal purposes and future communication
     */
    address: PostalAddress;
    /**
     * The date on which the nominee was born in ISO 8601 format (YYYY-MM-DD)
     */
    dob: string;
    /**
     * Gender of the nominee
     */
    gender?: string;
    /**
     * Legal guardian information required when the nominee is a minor, including guardian's personal and address details.<br>This field is required if nominee age is less than 18 ; otherwise, it will be ignored even if provided.
     */
    guardian?: Guardian;
    /**
     * Full name of the nominee.
     */
    name: string;
    /**
     * Relationship of a person with Applicant.<br>The allowed values will have to comply with 'relationship' in '/fi/enums/{name}/choices'.
     */
    relationship: string;
    /**
     * Specifies the percentage of the benefit or entitlement allocated to a nominee.<br>For simultaneous nominees: The total share percentage across all nominees must equal 100%.<br>For successive nominees: Each nominee must have a share percentage of 100%, as they receive the full benefit in succession.
     */
    sharePct?: number;
    /**
     * Mobile number of nominee in E.164 format
     */
    mobile?: string;
    /**
     * Email address of nominee
     */
    email?: string;
    /**
     * Phone number of nominee in E.164 format
     */
    phone?: string;
    /**
     * Extension number for the phone, if any
     */
    phoneExtension?: string;
};

