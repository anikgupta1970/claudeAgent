/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Validation constraint violation details
 */
export type Violation1 = {
    /**
     * The field for which the validation failed
     */
    field?: string;
    /**
     * Part of the http request where the validation error occurred such as query, path, header, form, body
     */
    in?: string;
    /**
     * Description of the validation error
     */
    message?: string;
};

