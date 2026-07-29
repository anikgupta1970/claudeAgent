/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactCategory } from './ContactCategory.js';
import type { ContactType } from './ContactType.js';
/**
 * Email contact details
 */
export type EmailContact = {
    /**
     * Contact type
     */
    type: ContactType;
    /**
     * Email address
     */
    email: string;
    /**
     * Contact category type
     */
    category: ContactCategory;
};

