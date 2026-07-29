/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressType } from './AddressType.js';
import type { PostalAddress } from './PostalAddress.js';
/**
 * Address with type classification
 */
export type PersonAddress = {
    /**
     * Type of address
     */
    type: AddressType;
    /**
     * Postal address details
     */
    address: PostalAddress;
};

