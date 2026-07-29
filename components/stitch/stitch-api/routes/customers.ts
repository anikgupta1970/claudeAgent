import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { z } from 'zod';
import { proxyPostRaw, STITCH_API_BASE } from '../middleware/proxy.js';
import {
  fdCalculatorRequestSchema,
  fdCalculatorResponseSchema,
  findCustomerRequestSchema,
  findCustomerResultSchema,
  listAccountsRequestSchema,
  accountResultSchema,
  profileRequestSchema,
  profileSchema,
  verifyBankAccountRequestSchema,
  bankAccountVerificationResultSchema,
  verifyUpiVpaRequestSchema,
  upiVpaVerificationResultSchema,
} from '../schemas/index.js';

/**
 * Individual customers routes - PROXY to Stitch API
 * Base path: /individual-customers
 *
 * Endpoints from OpenAPI spec (proxied):
 * - POST /fd/calculator - FD maturity calculation
 * - POST /find - Search for existing customer
 * - POST /info/accounts - Fetch customer accounts
 * - POST /info/profile - Fetch customer profile
 * - POST /verifications/bank-account - Verify bank account ownership
 * - POST /verifications/upi-vpa - Verify UPI VPA
 */
export const customerRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'proxy'); c.header('X-Proxy-Target', new URL(STITCH_API_BASE).hostname); })
  // FD Calculator
  .post(
    '/fd/calculator',
    zValidator('json', fdCalculatorRequestSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/individual-customers/fd/calculator');
      const data: z.infer<typeof fdCalculatorResponseSchema> = await upstream.json();
      return c.json(data);
    }
  )

  // Find customer
  .post(
    '/find',
    zValidator('json', findCustomerRequestSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/individual-customers/find');
      const data: z.infer<typeof findCustomerResultSchema> = await upstream.json();
      return c.json(data);
    }
  )

  // Fetch customer accounts
  .post(
    '/info/accounts',
    zValidator('json', listAccountsRequestSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/individual-customers/info/accounts');
      const data: z.infer<typeof accountResultSchema>[] = await upstream.json();
      return c.json(data);
    }
  )

  // Fetch customer profile
  .post(
    '/info/profile',
    zValidator('json', profileRequestSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/individual-customers/info/profile');
      const data: z.infer<typeof profileSchema> = await upstream.json();
      return c.json(data);
    }
  )

  // Verify bank account ownership
  .post(
    '/verifications/bank-account',
    zValidator('json', verifyBankAccountRequestSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/individual-customers/verifications/bank-account');
      const data: z.infer<typeof bankAccountVerificationResultSchema> = await upstream.json();
      return c.json(data);
    }
  )

  // Verify UPI VPA
  .post(
    '/verifications/upi-vpa',
    zValidator('json', verifyUpiVpaRequestSchema),
    async (c) => {
      const upstream = await proxyPostRaw(c, '/individual-customers/verifications/upi-vpa');
      const data: z.infer<typeof upiVpaVerificationResultSchema> = await upstream.json();
      return c.json(data);
    }
  );

export default customerRoutes;
