/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NominationRefType } from './NominationRefType.js';
/**
 * Nomination that references an existing nomination setup.<br>This approach is recommended when each instruction has same nominee or nominees.
 */
export type RefNomination = {
    /**
     * Nomination type indicator specifying that this nomination references an existing nomination setup stored elsewhere
     */
    type: NominationRefType;
    /**
     * Identifier of the form section with nomination details.<br>This field is required when type is "ref" ; otherwise, it will be ignored even if provided.<br>Must match exactly one section ID of type "nomination".
     */
    ref: string;
};

