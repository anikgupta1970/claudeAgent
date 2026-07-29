/**
 * MOCK ROUTES - Account
 * Returns static mock data for preview/development environments.
 * Base path: /account
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { accountVerifyRequestSchema } from '../schemas/index.js';

export const accountRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'mock'); })
  .post('/verify', zValidator('json', accountVerifyRequestSchema), async (c) => {
    return c.json({ status: 'verified' as const });
  });
