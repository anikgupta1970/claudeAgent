/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailContact } from './EmailContact.js';
import type { MobileContact } from './MobileContact.js';
import type { PhoneContact } from './PhoneContact.js';
/**
 * Contact information (mobile, email, or landline phone)
 */
export type Contact = (MobileContact | EmailContact | PhoneContact);

