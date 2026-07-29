import type { Context } from 'hono';
import { consola } from 'consola';

/**
 * Base URL for the Stitch Individual Customer API
 * Used for customer-related endpoints (accounts, FD calculator, etc.)
 */
export const STITCH_API_BASE =
  process.env.STITCH_API_BASE ||
  'https://stitch-individual-customer.apps.rosa.sdev.mi7j.p3.openshiftapps.com';

/**
 * Base URL for the Stitch Config API
 * Used for configuration endpoints (branches, locations, etc.)
 */
export const STITCH_CONFIG_API_BASE =
  process.env.STITCH_CONFIG_API_BASE ||
  'https://stitch-config-api.apps.rosa.sdev.mi7j.p3.openshiftapps.com';

/**
 * Base URL for the Stitch Capture API
 * Used for payment processing endpoints (initiate payment, check status)
 */
export const STITCH_CAPTURE_API_BASE =
  process.env.STITCH_CAPTURE_API_BASE ||
  'https://stitch-capture.apps.rosa.sdev.mi7j.p3.openshiftapps.com';

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
 * Logged fetch wrapper — logs method, URL, status, and duration for every
 * outgoing HTTP call.  Re-exported so route files that make direct fetch
 * calls can use the same logging.
 */
function formatHeaders(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      // Mask authorization tokens
      obj[key] = key.toLowerCase() === 'authorization' ? `${value.slice(0, 15)}…` : value;
    });
    return obj;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(
      headers.map(([k, v]) => [k, k.toLowerCase() === 'authorization' ? `${v.slice(0, 15)}…` : v])
    );
  }
  // Plain object
  const obj: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    obj[k] = k.toLowerCase() === 'authorization' ? `${v.slice(0, 15)}…` : v;
  }
  return obj;
}

export async function loggedFetch(
  url: string,
  init: RequestInit,
): Promise<globalThis.Response> {
  const method = init.method ?? 'GET';
  consola.info(`  ⇢ ${method} ${url}`);
  consola.debug('    headers:', formatHeaders(init.headers));
  if (init.body) {
    consola.debug('    body:', typeof init.body === 'string' ? init.body : '[non-string body]');
  }
  const start = Date.now();
  try {
    const response = await fetch(url, init);
    const duration = Date.now() - start;
    const log = response.ok ? consola.success : consola.warn;
    log(`  ⇠ ${method} ${url} ${response.status} ${duration}ms`);
    return response;
  } catch (error) {
    const duration = Date.now() - start;
    consola.error(`  ⇠ ${method} ${url} FAILED ${duration}ms`, error);
    throw error;
  }
}

/**
 * Create a proxy handler that forwards requests to the Stitch API
 *
 * @param basePath - The base path to append to the target URL (e.g., '/individual-customers')
 */
export function createProxyHandler(basePath: string = '') {
  return async (c: Context) => {
    const targetUrl = `${STITCH_API_BASE}${basePath}${c.req.path}`;

    // Build headers to forward
    const headers = new Headers();
    FORWARD_HEADERS.forEach((header) => {
      const value = c.req.header(header);
      if (value) {
        headers.set(header, value);
      }
    });

    // Get request body if present
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(c.req.method)) {
      body = await c.req.text();
    }

    try {
      // Forward the request to the target
      const response = await loggedFetch(targetUrl, {
        method: c.req.method,
        headers,
        body,
      });

      // Build response headers
      const responseHeaders = new Headers();
      response.headers.forEach((value, key) => {
        if (!EXCLUDE_RESPONSE_HEADERS.includes(key.toLowerCase())) {
          responseHeaders.set(key, value);
        }
      });

      // Return the proxied response
      const responseBody = await response.text();

      return new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      consola.error(`Proxy error for ${targetUrl}:`, error);

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
  };
}

/**
 * Proxy a single POST endpoint to the Stitch API
 */
export async function proxyPost(c: Context, targetPath: string) {
  const targetUrl = `${STITCH_API_BASE}${targetPath}`;

  // Build headers to forward
  const headers = new Headers();
  FORWARD_HEADERS.forEach((header) => {
    const value = c.req.header(header);
    if (value) {
      headers.set(header, value);
    }
  });

  // Get request body
  const body = await c.req.text();

  try {
    const response = await loggedFetch(targetUrl, {
      method: 'POST',
      headers,
      body,
    });

    // Build response headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!EXCLUDE_RESPONSE_HEADERS.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    consola.error(`Proxy error for ${targetUrl}:`, error);

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

/**
 * Proxy a POST request and return the raw upstream Response.
 * Used by typed route handlers that need to parse and type-assert the response
 * so Hono RPC can infer return types.
 */
export async function proxyPostRaw(
  c: Context,
  targetPath: string,
  targetBase: string = STITCH_API_BASE,
  bodyOverride?: string
): Promise<globalThis.Response> {
  const targetUrl = `${targetBase}${targetPath}`;

  const headers = new Headers();
  FORWARD_HEADERS.forEach((header) => {
    const value = c.req.header(header);
    if (value) {
      headers.set(header, value);
    }
  });

  const body = bodyOverride ?? await c.req.text();

  return loggedFetch(targetUrl, {
    method: 'POST',
    headers,
    body,
  });
}
