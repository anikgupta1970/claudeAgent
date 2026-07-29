import { createMiddleware } from 'hono/factory';
import { consola } from 'consola';

consola.level = 4; // debug

/**
 * Request logging middleware using consola
 *
 * Logs incoming requests and their responses with timing information.
 */
export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  const {method} = c.req;
  const {path} = c.req;
  const {url} = c.req;

  // Log incoming request
  consola.info(`--> ${method} ${path}`);

  await next();

  // Calculate duration
  const duration = Date.now() - start;
  const {status} = c.res;

  // Log response with status and timing
  const statusColor = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'success';

  if (status >= 500) {
    consola.error(`<-- ${method} ${path} ${status} ${duration}ms`);
  } else if (status >= 400) {
    consola.warn(`<-- ${method} ${path} ${status} ${duration}ms`);
  } else {
    consola.success(`<-- ${method} ${path} ${status} ${duration}ms`);
  }
});
