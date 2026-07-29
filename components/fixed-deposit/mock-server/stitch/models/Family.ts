/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Father } from './Father.js';
import type { Mother } from './Mother.js';
import type { Spouse } from './Spouse.js';
/**
 * Family member information
 */
export type Family = {
    /**
     * Mother's Information
     */
    mother: Mother;
    /**
     * Father's Information
     */
    father: Father;
    /**
     * Spouse's Information.<br>This field is required when marital status is married ; otherwise, it will be ignored even if provided.
     */
    spouse?: Spouse;
};

