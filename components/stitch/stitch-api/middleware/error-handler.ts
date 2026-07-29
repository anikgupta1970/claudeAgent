import type { Context, MiddlewareHandler } from 'hono';
import type { Problem } from '../types/common.js';

/**
 * Creates an RFC 7807 Problem Details response
 */
export function createProblem(
  c: Context,
  status: number,
  title: string,
  detail?: string,
  violations?: Problem['violations']
): Response {
  const problem: Problem = {
    status,
    title,
    instance: c.req.path,
    ...(detail && { detail }),
    ...(violations && { violations }),
  };

  return c.json(problem, status as any, {
    'Content-Type': 'application/problem+json',
  });
}

/**
 * Global error handler middleware
 */
export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    return await next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unhandled error:', error);

    if (error instanceof Error) {
      return createProblem(c, 500, 'Internal Server Error', error.message);
    }

    return createProblem(c, 500, 'Internal Server Error');
  }
};

/**
 * Not found handler
 */
export function notFoundHandler(c: Context) {
  return createProblem(c, 404, 'Not Found', 'The requested resource was not found');
}

/**
 * Validation error helper
 */
export function validationError(
  c: Context,
  violations: Problem['violations']
) {
  return createProblem(
    c,
    400,
    'Bad Request',
    'Validation failed',
    violations
  );
}
