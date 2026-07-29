/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PostalAddress } from './PostalAddress.js';
/**
 * Guardian information for minor nominees
 */
export type NomineesGuardian = {
    /**
     * Full name object of the person acting as guardian for the minor nominee
     */
    name: string;
    /**
     * Complete address object of the guardian.
     */
    address: PostalAddress;
};

