/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Postal Address
 */
export type PostalAddress = {
    /**
     * It includes details such as the building number, street name, and apartment or suite number
     */
    lines: Array<string>;
    /**
     * The name of the city where the address is located
     */
    city: string;
    /**
     * The state or union territory as per ISO 3166-2 state code
     */
    state: string;
    /**
     * Postal Code
     */
    pin: string;
    /**
     * The country as per ISO 3166-1 alpha-2 country code
     */
    country: string;
};

