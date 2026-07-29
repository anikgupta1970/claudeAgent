/**
 * MOCK ROUTES - Customers
 * Base path: /individual-customers
 *
 * Previously mocked /info/accounts and /info/profile.
 * Both now proxy to the real Stitch API via customerRoutes.
 * This file is kept as a no-op so existing imports don't break.
 */

import { Hono } from 'hono';

export const customerMockRoutes = new Hono();
