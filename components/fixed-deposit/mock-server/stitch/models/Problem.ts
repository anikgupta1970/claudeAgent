/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Violation } from './Violation.js';
/**
 * RFC 7807 Problem Details for HTTP APIs
 */
export type Problem = {
    /**
     * The HTTP status code for this occurrence of the problem
     */
    status: number;
    /**
     * A short, human-readable summary of the problem type
     */
    title: string;
    /**
     * A URI reference that identifies the specific occurrence of the problem
     */
    instance?: string;
    /**
     * A human-readable explanation specific to this occurrence of the problem
     */
    detail?: string;
    /**
     * List of validation constraint violations that occurred
     */
    violations?: Array<Violation>;
};

