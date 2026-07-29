import { Hono } from 'hono';
import { STITCH_CONFIG_API_BASE, loggedFetch } from '../middleware/proxy.js';

/**
 * Product routes - PROXY to Stitch Config API
 * Base path: /products
 *
 * Proxies FD product config from stitch-config-api.
 * Demo app calls: GET /products/fd?product=withdrawable_fd
 *                 GET /products/fd?product=non_withdrawable_fd
 */
export const productRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_CONFIG_API_BASE).hostname); })
  // GET /fd - Get FD product config
  .get('/fd', async (c) => {
    const url = new URL(c.req.url);
    const queryString = url.search;

    try {
      const response = await loggedFetch(`${STITCH_CONFIG_API_BASE}/fi/products/fd${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      return c.json(data, response.status as any);
    } catch (error) {
      console.error('Failed to fetch FD products:', error);
      return c.json({ error: 'Failed to fetch FD products' }, 502);
    }
  });

export default productRoutes;
