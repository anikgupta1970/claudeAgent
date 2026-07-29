import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { loggerMiddleware } from './middleware/logger.js';
import { authRoutes } from './routes/auth.js';
import { customerRoutes } from './routes/customers.js';
import { formRoutes } from './routes/forms.js';
import { paymentRoutes, ccavenueRoutes } from './routes/payments.js';
import {
  loginRoutes,
  tokenRoutes,
  myRoutes as myProductRoutes,
  locationRoutes,
  branchRoutes,
} from './routes/legacy.js';
import { journeyRoutes } from './routes/journey.js';
import { myFdRoutes } from './routes/fixed-deposit.js';
import { ifscRoutes } from './routes/ifsc.js';
import { translationsRoutes } from './routes/translations.js';
import { accountRoutes } from './routes/account.js';
import { customerMockRoutes } from './routes/mock-customers.js';
import { processingRoutes } from './routes/processing.js';
import { productRoutes } from './routes/products.js';

/**
 * Stitch API - Hono-based proxy/mock server with RPC support
 *
 * OpenAPI spec endpoints (PROXIED to real Stitch API):
 * Set STITCH_API_BASE env var to override the target.
 * Default: https://stitch-individual-customer.apps.rosa.sdev.mi7j.p3.openshiftapps.com
 *
 * - /auth/token/claims
 * - /individual-customers/fd/calculator
 * - /individual-customers/find
 * - /individual-customers/info/accounts
 * - /individual-customers/info/profile
 * - /individual-customers/verifications/bank-account
 * - /individual-customers/verifications/upi-vpa
 * - /forms
 * - /forms/status
 * - /forms/detailed-status
 * - /payments
 * - /payments/status
 * - /ccavenue/callback
 *
 * Processing endpoints (PROXIED to processing service for token generation):
 * Set PROCESSING_API_BASE env var to override the target.
 * Default: https://processing-route-stitch-e2.apps.rosa.sdev.mi7j.p3.openshiftapps.com
 *
 * - /processing/token
 *
 * Product config endpoints (PROXIED to stitch-config-api):
 * Set STITCH_CONFIG_API_BASE env var to override the target.
 *
 * - /products/fd?product=withdrawable_fd
 * - /products/fd?product=non_withdrawable_fd
 * - /login/terms -> /fi/terms (terms and conditions)
 *
 * Legacy endpoints (PROXIED to stubs.apibanking.dev/api/...):
 * Set STUBS_API_BASE env var to override the target.
 * Default: https://stubs.apibanking.dev
 *
 * - /login/authorize, /login/token -> /api/login/...
 * - /token/exchange -> /api/token/exchange
 * - /my/products, /my/products/fd, /my/products/sa -> /api/my/products/...
 * - /locations/states, /locations/districts, /locations/cities -> /api/locations/...
 * - /branches -> /api/branches
 *
 * Mock endpoints (returns static mock data):
 * - /journey/config
 * - /my/fd/session, /my/fd/details/*, /my/fd/submit, /my/fd/calculator
 * - /my/nominee
 * - /ifsc/:code
 * - /translations/:lang
 * - /account/verify
 */

// Create app with RPC-compatible chaining pattern
const app = new Hono()
  // Global middleware
  .use('*', loggerMiddleware)
  .use('*', corsMiddleware)
  .use('*', errorHandler)

  // Health check / root endpoint
  .get('/', (c) => c.json({
    status: 'ok',
    message: 'Stitch API Proxy Server',
    ...(process.env.DEPLOY_DATE ? { deployDate: process.env.DEPLOY_DATE } : {}),
  }))

  // OpenAPI spec routes (some use mocks for development)
  .route('/auth', authRoutes)
  .route('/individual-customers', customerMockRoutes)  // No-op, kept for import compatibility
  .route('/individual-customers', customerRoutes)       // All endpoints proxied to real Stitch API
  .route('/forms', formRoutes)
  .route('/payments', paymentRoutes)
  .route('/ccavenue', ccavenueRoutes)

  // Processing routes (proxied to processing service for token generation)
  .route('/processing', processingRoutes)

  // Product routes (proxied to stitch-config-api)
  .route('/products', productRoutes)

  // Legacy routes (proxied to stubs.apibanking.dev/api/...)
  .route('/login', loginRoutes)
  .route('/token', tokenRoutes)
  .route('/my', myProductRoutes)
  .route('/locations', locationRoutes)
  .route('/branches', branchRoutes)

  // Mock routes (not in OpenAPI spec or stubs)
  .route('/journey', journeyRoutes)
  .route('/my', myFdRoutes)
  .route('/ifsc', ifscRoutes)
  .route('/translations', translationsRoutes)
  .route('/account', accountRoutes)

  // 404 handler
  .notFound(notFoundHandler);

// Start server when run directly
const port = parseInt(process.env.PORT || '5000', 10);

export function run() {
  const server = serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(
        `🚀 Stitch API server running at http://localhost:${info.port}`
      );
    }
  );

  return {
    port,
    // implement stop to support HMR.
    stop: async () => {
      server.close();
    },
  };
}

export default () => {
  return run();
};

export { app };
