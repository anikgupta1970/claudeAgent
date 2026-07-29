/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Person's disability information
 */
export type Disability = {
    /**
     * Whether the person has any disability
     */
    isPersonWithDisability: boolean;
    /**
     * Type of disability if applicable.<br>The allowed values will have to comply with the 'disabilityType' defined in '/fi/enums'.
     */
    disabilityType?: string;
    /**
     * Percentage of disability as per medical certificate
     */
    disabilityPercentage?: number;
    /**
     * Disability certificate number if available
     */
    disabilityCertificateNumber?: string;
};

