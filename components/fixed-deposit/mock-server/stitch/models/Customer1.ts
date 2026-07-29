/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerGroup } from './CustomerGroup.js';
/**
 * Customer Information
 */
export type Customer1 = {
    /**
     * Customer group identifier
     */
    group?: CustomerGroup;
    /**
     * Indicates the tier which the customer belongs. e.g. based on the relationship, networth, etc.<br>The allowed values will have to comply with the 'customerTier' defined in '/fi/enums'.<br>However, other values can also be specified if they do not match the predefined ones.
     */
    tier?: string;
};

