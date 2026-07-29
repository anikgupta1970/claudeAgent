import { cors } from 'hono/cors';

/**
 * CORS middleware configuration for local development
 */
export const corsMiddleware = cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Client-Id', 'traceparent', 'Idempotency-Key'],
  exposeHeaders: ['Set-Cookie'],
  credentials: true,
  maxAge: 3600,
});
