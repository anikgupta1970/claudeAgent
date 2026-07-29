import type { Context, MiddlewareHandler } from 'hono';
import { createProblem } from './error-handler.js';

// Store authenticated token data in context
declare module 'hono' {
  interface ContextVariableMap {
    token: string;
    tokenClaims?: Record<string, unknown>;
  }
}

/**
 * Bearer token authentication middleware
 * Extracts and validates the Authorization header
 */
export const bearerAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return createProblem(c, 401, 'Unauthorized', 'Authorization header is required');
  }

  if (!authHeader.startsWith('Bearer ')) {
    return createProblem(c, 401, 'Unauthorized', 'Invalid authorization scheme');
  }

  const token = authHeader.slice(7); // Remove 'Bearer ' prefix

  if (!token || token.trim() === '') {
    return createProblem(c, 401, 'Unauthorized', 'Token is required');
  }

  // Store token in context for route handlers
  c.set('token', token);

  // In a real implementation, validate the token here
  // For mock purposes, we accept any non-empty token

  return next();
};

/**
 * Optional bearer auth - extracts token if present but doesn't require it
 */
export const optionalBearerAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token && token.trim() !== '') {
      c.set('token', token);
    }
  }

  await next();
};

/**
 * Get the current token from context
 */
export function getToken(c: Context): string | undefined {
  return c.get('token');
}
