import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { z } from 'zod';
import {
  STITCH_API_BASE,
  STITCH_CONFIG_API_BASE,
  STITCH_CAPTURE_API_BASE,
  loggedFetch,
} from '../middleware/proxy.js';
import {
  authorizeRequestSchema,
  authorizeResponseSchema,
  tokenExchangeRequestSchema,
  tokenResponseSchema,
  refreshTokenRequestSchema,
  branchQuerySchema,
  branchStatesQuerySchema,
  branchCitiesQuerySchema,
  locationQuerySchema,
  verifyUpiVpaRequestSchema,
  upiVpaVerificationResultSchema,
  paymentInitiationRequestSchema,
  paymentInitiationResultSchema,
  paymentStatusRequestSchema,
  paymentStatusResultSchema,
} from '../schemas/index.js';

/**
 * Base URL for the Stubs API
 */
const STUBS_API_BASE =
  process.env.STUBS_API_BASE || 'https://stubs.apibanking.dev';

/**
 * Default Client-Id for stubs API (used if not provided in request)
 */
const DEFAULT_CLIENT_ID = process.env.STUBS_CLIENT_ID || 'test-client-id';

/**
 * Build headers for stubs API requests
 */
function buildHeaders(c: any): Headers {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  // Use Client-Id from request or default
  const clientId =
    c.req.header('client-id') || c.req.header('Client-Id') || DEFAULT_CLIENT_ID;
  headers.set('Client-Id', clientId);

  // Forward authorization if present
  const auth = c.req.header('authorization') || c.req.header('Authorization');
  if (auth) {
    headers.set('Authorization', auth);
  }

  return headers;
}

/**
 * Login routes
 * Base path: /login
 */
export const loginRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STUBS_API_BASE).hostname); })
  // GET /terms - Get terms and conditions (proxied to stitch-config-api)
  .get('/terms', async (c) => {
    try {
      const response = await loggedFetch(`${STITCH_CONFIG_API_BASE}/fi/terms`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      const data: Array<{
        code: string;
        summary: string;
        url?: string;
        content?: string;
      }> = await response.json();
      // Transform config-api response to match frontend TermsResponse shape
      return c.json({
        terms: data.map((t) => ({
          id: t.code,
          summary: t.summary,
          ...(t.url && { documentUrl: t.url }),
          ...(t.content && { content: t.content }),
        })),
      });
    } catch (error) {
      console.error('Failed to fetch terms:', error);
      return c.json(
        {
          error: 'Failed to fetch terms',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        502
      );
    }
  })

  // POST /authorize - Authorize login and get OTP session
  .post('/authorize', zValidator('json', authorizeRequestSchema), async (c) => {
    const headers = buildHeaders(c);
    const body = c.req.valid('json');

    // Frontend sends acceptedTerms with `id`, but stubs API expects `code`
    const stubsBody = {
      ...body,
      acceptedTerms: (body.acceptedTerms || []).map(({ id, ...rest }) => ({
        ...rest,
        id,
      })),
    };

    try {
      const response = await loggedFetch(`${STUBS_API_BASE}/api/login/authorize`, {
        method: 'POST',
        headers,
        body: JSON.stringify(stubsBody),
      });

      const text = await response.text();
      if (!text) {
        console.error(
          'Empty response from stubs API, status:',
          response.status
        );
        return c.json(
          {
            errors: [
              {
                field: 'general',
                message: 'Empty response from authentication server',
              },
            ],
          },
          502
        );
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Non-JSON response from stubs API:', text.slice(0, 200));
        return c.json(
          {
            errors: [
              {
                field: 'general',
                message: 'Invalid response from authentication server',
              },
            ],
          },
          502
        );
      }

      // Handle error responses from stubs API
      if (!response.ok) {
        return c.json(
          {
            errors: data.errors || [
              {
                field: 'general',
                message: data.message || data.detail || 'Authorization failed',
              },
            ],
          },
          400
        );
      }

      const result: z.infer<typeof authorizeResponseSchema> = data;
      return c.json(result);
    } catch (error) {
      console.error('Failed to authorize:', error);
      return c.json(
        {
          errors: [
            {
              field: 'general',
              message: 'Failed to connect to authentication server',
            },
          ],
        },
        502
      );
    }
  })

  // POST /token - Exchange OTP for access token
  .post('/token', zValidator('json', tokenExchangeRequestSchema), async (c) => {
    const headers = buildHeaders(c);
    const body = c.req.valid('json');

    try {
      const response = await loggedFetch(`${STUBS_API_BASE}/api/login/token`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // Handle error responses (including invalid OTP)
      if (!response.ok) {
        return c.json(
          {
            errors: data.errors || [
              {
                field: 'otp',
                message:
                  data.message ||
                  data.detail ||
                  'Invalid OTP or session expired',
              },
            ],
          },
          400
        );
      }

      const result: z.infer<typeof tokenResponseSchema> = data;
      return c.json(result);
    } catch (error) {
      console.error('Failed to exchange token:', error);
      return c.json(
        {
          errors: [{ field: 'general', message: 'Failed to verify OTP' }],
        },
        502
      );
    }
  });

/**
 * Token routes
 * Base path: /token
 */
export const tokenRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STUBS_API_BASE).hostname); })
  // POST /exchange - Refresh/exchange token
  .post(
    '/exchange',
    zValidator('json', refreshTokenRequestSchema),
    async (c) => {
      const headers = buildHeaders(c);
      const body = c.req.valid('json');

      try {
        const response = await loggedFetch(`${STUBS_API_BASE}/api/token/exchange`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          return c.json(
            {
              errors: data.errors || [
                {
                  field: 'general',
                  message:
                    data.message || data.detail || 'Token exchange failed',
                },
              ],
            },
            400
          );
        }

        const result: z.infer<typeof tokenResponseSchema> = data;
        return c.json(result);
      } catch (error) {
        console.error('Failed to exchange token:', error);
        return c.json(
          {
            errors: [{ field: 'general', message: 'Failed to refresh token' }],
          },
          502
        );
      }
    }
  );

/**
 * My routes (products)
 * Base path: /my
 */
export const myRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STUBS_API_BASE).hostname); })
  // GET /products - Get all products
  .get('/products', async (c) => {
    const headers = buildHeaders(c);

    try {
      const response = await loggedFetch(`${STUBS_API_BASE}/api/my/products`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return c.json({ error: 'Failed to fetch products' }, 502);
    }
  })

  // GET /products/fd - Get FD products
  .get('/products/fd', async (c) => {
    const headers = buildHeaders(c);

    try {
      const response = await loggedFetch(`${STUBS_API_BASE}/api/my/products/fd`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch FD products:', error);
      return c.json({ error: 'Failed to fetch FD products' }, 502);
    }
  })

  // GET /products/sa - Get SA products
  .get('/products/sa', async (c) => {
    const headers = buildHeaders(c);

    try {
      const response = await loggedFetch(`${STUBS_API_BASE}/api/my/products/sa`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch SA products:', error);
      return c.json({ error: 'Failed to fetch SA products' }, 502);
    }
  });

/**
 * Location routes
 * Base path: /locations
 */
export const locationRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STUBS_API_BASE).hostname); })
  // GET /states - Get states
  .get('/states', zValidator('query', locationQuerySchema), async (c) => {
    const headers = buildHeaders(c);
    const url = new URL(c.req.url);
    const queryString = url.search;

    try {
      const response = await fetch(
        `${STUBS_API_BASE}/api/locations/states${queryString}`,
        {
          method: 'GET',
          headers,
        }
      );

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch states:', error);
      return c.json({ error: 'Failed to fetch states' }, 502);
    }
  })

  // GET /districts - Get districts
  .get('/districts', zValidator('query', locationQuerySchema), async (c) => {
    const headers = buildHeaders(c);
    const url = new URL(c.req.url);
    const queryString = url.search;

    try {
      const response = await fetch(
        `${STUBS_API_BASE}/api/locations/districts${queryString}`,
        {
          method: 'GET',
          headers,
        }
      );

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      return c.json({ error: 'Failed to fetch districts' }, 502);
    }
  })

  // GET /cities - Get cities
  .get('/cities', zValidator('query', locationQuerySchema), async (c) => {
    const headers = buildHeaders(c);
    const url = new URL(c.req.url);
    const queryString = url.search;

    try {
      const response = await fetch(
        `${STUBS_API_BASE}/api/locations/cities${queryString}`,
        {
          method: 'GET',
          headers,
        }
      );

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      return c.json({ error: 'Failed to fetch cities' }, 502);
    }
  });

/**
 * Branch routes - PROXY to Stitch Config API
 * Base path: /branches
 */
export const branchRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_CONFIG_API_BASE).hostname); })
  // GET /states - Get states where branches are available
  .get('/states', zValidator('query', branchStatesQuerySchema), async (c) => {
    const url = new URL(c.req.url);
    const country = url.searchParams.get('country') || 'IN';

    const queryString = `?country=${country}&facility=branch`;

    try {
      const response = await fetch(
        `${STITCH_CONFIG_API_BASE}/fi/locations/states${queryString}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch branch states:', error);
      return c.json({ error: 'Failed to fetch branch states' }, 502);
    }
  })

  // GET /cities - Get cities in a state where branches are available
  .get('/cities', zValidator('query', branchCitiesQuerySchema), async (c) => {
    const url = new URL(c.req.url);
    const country = url.searchParams.get('country') || 'IN';
    const state = url.searchParams.get('state');

    if (!state) {
      return c.json({ error: 'state parameter is required' }, 400);
    }

    const queryString = `?country=${country}&state=${state}&facility=branch`;

    try {
      const response = await fetch(
        `${STITCH_CONFIG_API_BASE}/fi/locations/cities${queryString}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch branch cities:', error);
      return c.json({ error: 'Failed to fetch branch cities' }, 502);
    }
  })

  // GET / - Get branches by location or pincode
  .get('/', zValidator('query', branchQuerySchema), async (c) => {
    // Build query params, mapping 'pin' to 'postalCode' for Stitch API
    const url = new URL(c.req.url);
    const targetParams = new URLSearchParams();

    const country = url.searchParams.get('country');
    const state = url.searchParams.get('state');
    const city = url.searchParams.get('city');
    const pin = url.searchParams.get('pin');
    const postalCode = url.searchParams.get('postalCode');

    if (country) targetParams.set('country', country);
    if (state) targetParams.set('state', state);
    if (city) targetParams.set('city', city);
    // Map 'pin' to 'postalCode' for Stitch API compatibility
    if (postalCode) targetParams.set('postalCode', postalCode);
    else if (pin) targetParams.set('postalCode', pin);

    const queryString = targetParams.toString()
      ? `?${targetParams.toString()}`
      : '';

    try {
      const response = await fetch(
        `${STITCH_CONFIG_API_BASE}/fi/branches${queryString}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const data = await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      return c.json({ error: 'Failed to fetch branches' }, 502);
    }
  });

/**
 * Verification routes - PROXY to Stitch Individual Customer API
 * Base path: /verifications
 */
export const verificationRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_API_BASE).hostname); })
  // POST /upi-vpa - Verify UPI VPA ID
  .post(
    '/upi-vpa',
    zValidator('json', verifyUpiVpaRequestSchema),
    async (c) => {
      const body = c.req.valid('json');
      const auth =
        c.req.header('authorization') || c.req.header('Authorization');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (auth) {
        headers.Authorization = auth;
      }

      try {
        const { customerId: _cid, ...upstreamBody } = body;
        const response = await loggedFetch(
          `${STITCH_API_BASE}/individual-customers/verifications/upi-vpa`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(upstreamBody),
          }
        );

        const data: z.infer<typeof upiVpaVerificationResultSchema> =
          await response.json();
        return c.json(data);
      } catch (error) {
        console.error('Failed to verify UPI VPA:', error);
        return c.json({ error: 'Failed to verify UPI VPA' }, 502);
      }
    }
  );

/**
 * Payment routes - PROXY to Stitch Capture API
 * Base path: /payments
 */
export const paymentRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_CAPTURE_API_BASE).hostname); })
  // POST /status - Check payment status
  .post(
    '/status',
    zValidator('json', paymentStatusRequestSchema),
    async (c) => {
      const body = c.req.valid('json');
      const auth =
        c.req.header('authorization') || c.req.header('Authorization');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (auth) {
        headers.Authorization = auth;
      }

      try {
        const response = await fetch(
          `${STITCH_CAPTURE_API_BASE}/payments/status`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
          }
        );

        const data: z.infer<typeof paymentStatusResultSchema> =
          await response.json();
        return c.json(data);
      } catch (error) {
        console.error('Failed to check payment status:', error);
        return c.json({ error: 'Failed to check payment status' }, 502);
      }
    }
  )

  // POST / - Initiate a payment
  .post('/', zValidator('json', paymentInitiationRequestSchema), async (c) => {
    const body = c.req.valid('json');
    const auth = c.req.header('authorization') || c.req.header('Authorization');
    const idempotencyKey =
      c.req.header('idempotency-key') || c.req.header('Idempotency-Key');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (auth) {
      headers.Authorization = auth;
    }
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    try {
      const response = await loggedFetch(`${STITCH_CAPTURE_API_BASE}/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data: z.infer<typeof paymentInitiationResultSchema> =
        await response.json();
      return c.json(data);
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      return c.json({ error: 'Failed to initiate payment' }, 502);
    }
  });

// Keep legacyRoutes for backwards compatibility (deprecated)
export const legacyRoutes = new Hono()
  .route('/login', loginRoutes)
  .route('/token', tokenRoutes)
  .route('/my', myRoutes)
  .route('/locations', locationRoutes)
  .route('/branches', branchRoutes)
  .route('/verifications', verificationRoutes)
  .route('/payments', paymentRoutes);

export default legacyRoutes;
