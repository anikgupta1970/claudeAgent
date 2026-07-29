import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { z } from 'zod';
import { proxyPostRaw, STITCH_API_BASE } from '../middleware/proxy.js';
import {
  findCustomerArgsSchema,
  tokenClaimsResponseSchema,
} from '../schemas/index.js';

/**
 * Auth routes - PROXY to Stitch API
 * Base path: /auth
 *
 * Endpoints from OpenAPI spec (proxied):
 * - POST /token/claims - Get token claims for a customer
 */
export const authRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_API_BASE).hostname); })
  // Token claims endpoint
  .post(
    '/token/claims',
    zValidator('json', findCustomerArgsSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/auth/token/claims');
      const data: z.infer<typeof tokenClaimsResponseSchema> = await upstream.json();
      return c.json(data);
    }
  );

export default authRoutes;
