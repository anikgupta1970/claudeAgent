/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Person name details
 */
export type IndividualName = {
    /**
     * The title representing salutations for formal identification.<br>The allowed values will have to comply with the 'person name prefix' defined in '/fi/enums'.
     */
    prefix?: string;
    /**
     * First name of an individual<br>When combined with middleName and lastName, the total length must be less than or equal to 40 characters.
     */
    firstName: string;
    /**
     * Middle name of an individual<br>When combined with firstName and lastName, the total length must be less than or equal to 40 characters.
     */
    middleName?: string;
    /**
     * Last name of an individual<br>When combined with firstName and middleName, the total length must be less than or equal to 40 characters.
     */
    lastName: string;
    /**
     * Maiden Name in case of female individual
     */
    maidenName?: string;
    /**
     * Short name of an individual if any
     */
    shortName?: string;
};

