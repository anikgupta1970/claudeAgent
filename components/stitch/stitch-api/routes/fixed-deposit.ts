/**
 * MOCK ROUTES - Fixed Deposit
 * Returns static mock data for preview/development environments.
 * Base path: /my
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  depositDetailsRequestSchema,
  bankDetailsRequestSchema,
} from '../schemas/index.js';

// Mock Session
const mockSession = {
  success: true as const,
  session: {
    depositData: null,
    bankData: null,
    currentStep: 1,
    createdAt: new Date().toISOString(),
  },
};

// Mock Submit Response
const mockSubmitResponse = {
  success: true as const,
  applicationId: `FD${Date.now().toString().slice(-8)}`,
};

// Mock Success Response
const mockSuccessResponse = {
  success: true as const,
};

// Mock FD Calculator Response
const mockCalculatorResponse = {
  maturityAmount: { amount: 107100, currency: 'INR' },
  roi: 7.1,
  interestEarned: { amount: 7100, currency: 'INR' },
  maturityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  startDate: new Date().toISOString().split('T')[0],
};

export const myFdRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'mock'); })
  .get('/fd/session', (c) => c.json(mockSession))
  .put('/fd/details/deposit', zValidator('json', depositDetailsRequestSchema), async (c) => {
    return c.json(mockSuccessResponse);
  })
  .put('/fd/details/bank', zValidator('json', bankDetailsRequestSchema), async (c) => {
    return c.json(mockSuccessResponse);
  })
  .post('/fd/submit', (c) => c.json(mockSubmitResponse))
  .post('/fd/calculator', async (c) => {
    // Mock calculator - returns static mock data
    await c.req.json(); // consume body
    return c.json(mockCalculatorResponse);
  });
