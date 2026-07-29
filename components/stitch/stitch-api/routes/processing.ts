import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { z } from 'zod';
import { loggedFetch } from '../middleware/proxy.js';
import {
  processingTokenRequestSchema,
  processingTokenResponseSchema,
} from '../schemas/index.js';

/**
 * Processing API routes
 *
 * This proxies to the processing service that generates valid Stitch API tokens
 * from claims (customer_id, client_id).
 *
 * The stubs.apibanking.dev login returns tokens that aren't valid for the real
 * Stitch API. This processing service converts the customer ID from the stubs
 * token into a valid Stitch API access token.
 */

const PROCESSING_API_BASE =
  process.env.PROCESSING_API_BASE ||
  'https://processing-route-stitch-e2.apps.rosa.sdev.mi7j.p3.openshiftapps.com';

/**
 * Processing routes
 * Base path: /processing
 */
export const processingRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(PROCESSING_API_BASE).hostname); })
  // POST /token - Generate Stitch API token from claims
  .post('/token', zValidator('json', processingTokenRequestSchema), async (c) => {
    const body = c.req.valid('json');

    try {
      const response = await loggedFetch(`${PROCESSING_API_BASE}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return c.json(
          {
            error: 'Token generation failed',
            detail: data.message || data.detail || 'Unknown error',
          },
          400
        );
      }

      const result: z.infer<typeof processingTokenResponseSchema> = data;
      return c.json(result);
    } catch (error) {
      console.error('Failed to generate token:', error);
      return c.json(
        {
          error: 'Failed to generate token',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        502
      );
    }
  });

export default processingRoutes;
