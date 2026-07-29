/**
 * MOCK ROUTES - Journey
 * Returns static mock data for preview/development environments.
 * Base path: /journey
 */

import { Hono } from 'hono';

// Default tenant config (current/existing)
const defaultConfig = {
  journeyType: 'customer-fd',
  logoUrl:
    'https://stitch-preview-spliceforms-ui.apps.rosa.sdev.mi7j.p3.openshiftapps.com/logo.svg',
  interestRatesUrl: 'https://example.com/interest-rates',
  stepTitles: ['Deposit Details', 'Bank Details'],
  requiredAggregates: [
    { key: 'depositDetails', label: 'Deposit Details', fields: {} },
    { key: 'bankDetails', label: 'Bank Details', fields: {} },
  ],
  components: {
    'deposit-details': {
      id: 'deposit-details',
      type: 'DepositDetails',
      props: { allowedFdTypes: ['withdrawable', 'non-withdrawable'] },
    },
    'bank-details': {
      id: 'bank-details',
      type: 'BankDetails',
      props: {
        fdAmount: 100000,
        primaryAccount: {
          accountNumber: '****1234',
          accountType: 'SAVINGS ACCOUNT',
          availableBalance: 500000,
        },
      },
    },
  },
  layout: {
    type: 'stepper',
    config: { stepTitles: ['Deposit Details', 'Bank Details'] },
    children: [
      { componentId: 'deposit-details' },
      { componentId: 'bank-details' },
    ],
  },
};

// Partner tenant config with different logo and green/orange theme
const partnerConfig = {
  ...defaultConfig,
  logoUrl: 'https://placehold.co/400x200?text=Partner+Bank&font=roboto',
  theme: {
    colors: {
      primary: { default: '#1B5E20', hover: '#2E7D32', active: '#388E3C' },
      secondary: { default: '#E65100', hover: '#EF6C00', active: '#F57C00' },
      surface: {
        background: '#F1F8E9',
        primary: '#FFFFFF',
        secondary: '#DCEDC8',
      },
      surfaceDark: { default: '#263238', hover: '#37474F', active: '#455A64' },
    },
  },
};

// Tenant config map
const tenantConfigs: Record<string, typeof defaultConfig> = {
  default: defaultConfig,
  partner: partnerConfig,
};

export const journeyRoutes = new Hono()
  .use('*', async (c, next) => {
    await next();
    c.header('X-Source', 'mock');
  })
  .get('/config', (c) => {
    const tenant = c.req.query('tenant') || 'default';
    const config = tenantConfigs[tenant] || tenantConfigs['default'];
    return c.json({ journeyConfig: config });
  });
