import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { z } from 'zod';
import { proxyPostRaw, STITCH_CAPTURE_API_BASE } from '../middleware/proxy.js';
import {
  customerApplicationFormSchema,
  submitApplicationFormStatusSchema,
  formStatusRequestSchema,
  formStatusResponseSchema,
  formDetailedStatusResponseSchema,
} from '../schemas/index.js';

/**
 * Forms routes - PROXY to Stitch API
 * Base path: /forms
 *
 * Endpoints from OpenAPI spec (proxied):
 * - POST / - Submit application form
 * - POST /status - Fetch application processing status
 * - POST /detailed-status - Fetch detailed application processing status
 */
export const formRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_CAPTURE_API_BASE).hostname); })
  // Submit application form — proxied to STITCH_CAPTURE_API_BASE
  .post(
    '/',
    zValidator('json', customerApplicationFormSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/forms', STITCH_CAPTURE_API_BASE);
      const data: z.infer<typeof submitApplicationFormStatusSchema> = await upstream.json();
      return c.json(data);
    }
  )

  // Fetch application processing status — proxied to STITCH_CAPTURE_API_BASE
  .post(
    '/status',
    zValidator('json', formStatusRequestSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/forms/status', STITCH_CAPTURE_API_BASE);
      const data: z.infer<typeof formStatusResponseSchema> = await upstream.json();
      return c.json(data);
    }
  )

  // Fetch detailed application processing status — proxied to STITCH_CAPTURE_API_BASE
  .post(
    '/detailed-status',
    zValidator('json', formStatusRequestSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/forms/detailed-status', STITCH_CAPTURE_API_BASE);
      const data: z.infer<typeof formDetailedStatusResponseSchema> = await upstream.json();
      return c.json(data);
    }
  );

export default formRoutes;
