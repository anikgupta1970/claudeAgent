/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Bda } from './Bda.js';
import type { Customer1 } from './Customer1.js';
import type { Lead } from './Lead.js';
import type { Mis } from './Mis.js';
import type { Originator } from './Originator.js';
import type { Promotion } from './Promotion.js';
import type { RelationshipManager } from './RelationshipManager.js';
import type { SectionType } from './SectionType.js';
/**
 * Section with office use only information
 */
export type OfficeUseSection = {
    /**
     * A unique identifier assigned to each section
     */
    id: string;
    /**
     * Section type classification for this section within the application form structure
     */
    section: SectionType;
    /**
     * An entity which is originating/sourcing the application form
     */
    originator: Originator;
    /**
     * Promotion code
     */
    promotion?: Promotion;
    /**
     * Relationship manager information
     */
    rm?: RelationshipManager;
    /**
     * Lead information
     */
    lead?: Lead;
    /**
     * MIS information
     */
    mis?: Mis;
    /**
     * Customer identifier information
     */
    customer?: Customer1;
    /**
     * BDA information
     */
    bda?: Bda;
};

