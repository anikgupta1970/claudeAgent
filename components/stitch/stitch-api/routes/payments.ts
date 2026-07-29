import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { z } from 'zod';
import { STITCH_CAPTURE_API_BASE, loggedFetch } from '../middleware/proxy.js';
import {
  paymentInitiationRequestSchema,
  paymentStatusRequestSchema,
  paymentStatusResultSchema,
} from '../schemas/index.js';

/**
 * Headers to forward from the original request
 */
const FORWARD_HEADERS = [
  'authorization',
  'content-type',
  'accept',
  'traceparent',
  'client-id',
  'idempotency-key',
];

/**
 * Headers to exclude from the proxied response
 */
const EXCLUDE_RESPONSE_HEADERS = [
  'transfer-encoding',
  'connection',
  'keep-alive',
];

/**
 * Generate a UUID v4 for idempotency key
 */
function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Build forwarding headers from the incoming request
 */
function buildForwardHeaders(c: { req: { header: (name: string) => string | undefined } }): Headers {
  const headers = new Headers();
  FORWARD_HEADERS.forEach((header) => {
    const value = c.req.header(header);
    if (value) {
      headers.set(header, value);
    }
  });
  return headers;
}

/**
 * Filter response headers, removing excluded ones
 */
function filterResponseHeaders(response: globalThis.Response): Headers {
  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (!EXCLUDE_RESPONSE_HEADERS.includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });
  return responseHeaders;
}

/**
 * Payment routes - PROXY to Stitch Capture API
 * Base path: /payments
 *
 * Endpoints from OpenAPI spec (proxied):
 * - POST / - Initiate payment (requires Idempotency-Key header)
 * - POST /status - Fetch payment status
 */
export const paymentRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_CAPTURE_API_BASE).hostname); })
  // Initiate payment - proxied to STITCH_CAPTURE_API_BASE
  .post(
    '/',
    zValidator('json', paymentInitiationRequestSchema),
    async (c) => {
      const targetUrl = `${STITCH_CAPTURE_API_BASE}/payments`;

      const headers = buildForwardHeaders(c);

      // Ensure Idempotency-Key is present (generate if not provided)
      if (!headers.has('idempotency-key')) {
        headers.set('Idempotency-Key', generateUUID());
      }

      const body = await c.req.text();

      try {
        const response = await loggedFetch(targetUrl, {
          method: 'POST',
          headers,
          body,
        });

        const responseHeaders = filterResponseHeaders(response);
        const responseBody = await response.text();

        return new Response(responseBody, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } catch (error) {
        console.error(`Proxy error for ${targetUrl}:`, error);
        return c.json(
          {
            status: 502,
            title: 'Bad Gateway',
            detail: `Failed to proxy request to ${targetUrl}`,
            instance: c.req.path,
          },
          502
        );
      }
    }
  )

  // Fetch payment status - proxied to STITCH_CAPTURE_API_BASE
  .post(
    '/status',
    zValidator('json', paymentStatusRequestSchema),
    async (c) => {
      const targetUrl = `${STITCH_CAPTURE_API_BASE}/payments/status`;

      const headers = buildForwardHeaders(c);
      const body = await c.req.text();

      try {
        const response = await loggedFetch(targetUrl, {
          method: 'POST',
          headers,
          body,
        });

        const data: z.infer<typeof paymentStatusResultSchema> = await response.json();
        return c.json(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Proxy error for ${targetUrl}:`, error);
        return c.json(
          {
            status: 502,
            title: 'Bad Gateway',
            detail: `Failed to proxy request to ${targetUrl}`,
            instance: c.req.path,
          },
          502
        );
      }
    }
  );

/**
 * CCAvenue callback routes - PROXY to Stitch API
 * Base path: /ccavenue
 *
 * Endpoints from OpenAPI spec (proxied):
 * - POST /callback - Receive payment callback from CCAvenue
 */
export const ccavenueRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_CAPTURE_API_BASE).hostname); })
  // CCAvenue callback - proxies plain text
  .post('/callback', async (c) => {
    const targetUrl = `${STITCH_CAPTURE_API_BASE}/ccavenue/callback`;
    const body = await c.req.text();

    try {
      const response = await loggedFetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body,
      });

      const responseBody = await response.text();

      return new Response(responseBody, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/html',
        },
      });
    } catch (error) {
      console.error(`Proxy error for ${targetUrl}:`, error);
      return c.html('<html><body><h1>Payment callback failed</h1></body></html>', 502);
    }
  });

export default paymentRoutes;
