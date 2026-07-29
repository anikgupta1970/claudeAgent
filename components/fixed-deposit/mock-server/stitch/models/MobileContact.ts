/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactCategory } from './ContactCategory.js';
import type { ContactType } from './ContactType.js';
/**
 * Mobile phone contact details
 */
export type MobileContact = {
    /**
     * Contact type
     */
    type: ContactType;
    /**
     * Mobile number of the customer in E.164 format
     */
    mobile: string;
    /**
     * Contact category type
     */
    category: ContactCategory;
    /**
     * Mobile service provider
     */
    serviceProvider?: string;
};

