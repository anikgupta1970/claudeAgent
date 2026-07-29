/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Name of the person
 */
export type PersonName = {
    /**
     * First name.<br>When combined with middleName and lastName, the total length must be less than or equal to 40 characters.
     */
    firstName: string;
    /**
     * Middle name.<br>When combined with firstName and lastName, the total length must be less than or equal to 40 characters.
     */
    middleName?: string;
    /**
     * Last name.<br>When combined with firstName and middleName, the total length must be less than or equal to 40 characters.
     */
    lastName: string;
};

