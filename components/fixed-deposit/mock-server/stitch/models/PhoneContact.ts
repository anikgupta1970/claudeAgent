/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactCategory } from './ContactCategory.js';
import type { ContactType } from './ContactType.js';
/**
 * Landline phone contact details
 */
export type PhoneContact = {
    /**
     * Contact type
     */
    type: ContactType;
    /**
     * Phone number in E.164 format
     */
    phone: string;
    /**
     * Contact category type
     */
    category: ContactCategory;
    /**
     * Extension number
     */
    extension?: string;
};

