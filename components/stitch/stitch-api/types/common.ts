// Common types used across the API

/**
 * Money type representing a monetary value with currency
 * Based on OpenAPI spec: components/schemas/Money
 */
export interface Money {
  amount: number;
  currency: string; // ISO 4217 alpha-3 code (e.g., "INR")
}

/**
 * Postal address following ISO standards
 * Based on OpenAPI spec: components/schemas/PostalAddress
 */
export interface PostalAddress {
  lines: string[]; // 1-3 address lines
  city: string;
  state: string; // ISO 3166-2 state code (e.g., "MH")
  pin: string; // 6-digit postal code
  country: string; // ISO 3166-1 alpha-2 (e.g., "IN")
}

/**
 * Validation violation details
 * Based on OpenAPI spec: components/schemas/Violation
 */
export interface Violation {
  field: string;
  in?: 'body' | 'header' | 'query' | 'path';
  message: string;
}

/**
 * RFC 7807 Problem Details for HTTP APIs
 * Based on OpenAPI spec: components/schemas/Problem
 */
export interface Problem {
  status: number;
  title: string;
  instance?: string;
  detail?: string;
  violations?: Violation[];
}

/**
 * Customer ID type - can be numeric (6-12 chars) or alphanumeric (6-48 chars)
 */
export type CustomerId = string;

/**
 * ISO 8601 duration format for tenure (e.g., "P1Y6M" for 1 year 6 months)
 */
export type Duration = string;

/**
 * ISO 8601 date format (YYYY-MM-DD)
 */
export type ISODate = string;
