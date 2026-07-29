/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Validation violation details
 */
export type Violation = {
    /**
     * The field that caused the violation
     */
    field?: string;
    /**
     * Location of the field
     */
    in?: Violation.In;
    /**
     * Human-readable violation message
     */
    message?: string;
};
export namespace Violation {
    /**
     * Location of the field
     */
    export enum In {
        BODY = 'body',
        HEADER = 'header',
        QUERY = 'query',
        PATH = 'path',
    }
}

