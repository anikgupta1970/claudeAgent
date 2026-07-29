/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PostalAddress } from './PostalAddress.js';
/**
 * Guardian information for a minor nominee
 */
export type Guardian = {
    /**
     * Complete residential address of the guardian, required for legal documentation and communication purposes
     */
    address: PostalAddress;
    /**
     * Date of birth of the guardian in ISO 8601 format (YYYY-MM-DD). Age should be equal to or above 18 years.
     */
    dob: string;
    /**
     * Relationship of a person with Applicant
     */
    relationWithNominee?: string;
    /**
     * Full name of the person acting as guardian for the minor
     */
    name: string;
    /**
     * Mobile number of guardian in E.164 format
     */
    mobile?: string;
    /**
     * Email address of guardian
     */
    email?: string;
    /**
     * Phone number of guardian in E.164 format
     */
    phone?: string;
    /**
     * Extension number for the phone, if any
     */
    phoneExtension?: string;
};

