/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Instruction } from './Instruction.js';
import type { Section } from './Section.js';
/**
 * A complete application form containing the set of instructions and supporting sections required for account opening or customer creation or enabling faclities.
 */
export type CustomerApplicationForm = {
    /**
     * Instruction for various banking operations such as account opening, customer onboarding, sweep out setup, alerts, and digital banking enablement.
     */
    instructions: Array<Instruction>;
    /**
     * List of sections (Payment, Office-use, Nomination).<br>There can be multiple nomination sections, but only one office-use section and one payment section.<br>The office-use section is the only mandatory section.
     */
    sections: Array<Section>;
};

