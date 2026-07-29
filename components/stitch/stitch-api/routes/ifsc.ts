/**
 * MOCK ROUTES - IFSC
 * Returns static mock data for preview/development environments.
 * Base path: /ifsc
 */

import { Hono } from 'hono';

// Mock IFSC database: map bank prefixes to bank names
const bankPrefixes: Record<
  string,
  {
    bankName: string;
    branches: Record<string, { branchName: string; city: string }>;
  }
> = {
  SBIN: {
    bankName: 'State Bank of India',
    branches: {
      SBIN0009101: { branchName: 'MUMBAI MAIN', city: 'Mumbai, Maharashtra' },
      SBIN0001234: { branchName: 'DELHI MAIN', city: 'New Delhi, Delhi' },
      SBIN0002345: { branchName: 'BANGALORE MAIN', city: 'Bangalore, Karnataka' },
    },
  },
  SBI: {
    bankName: 'State Bank of India',
    branches: {
      SBI0009101: { branchName: 'MUMBAI MAIN', city: 'Mumbai, Maharashtra' },
    },
  },
  ICIC: {
    bankName: 'ICICI Bank',
    branches: {
      ICIC0001234: { branchName: 'ANDHERI WEST', city: 'Mumbai, Maharashtra' },
      ICIC0002345: { branchName: 'CONNAUGHT PLACE', city: 'New Delhi, Delhi' },
    },
  },
  HDFC: {
    bankName: 'HDFC Bank',
    branches: {
      HDFC0000003: { branchName: 'K G MARG', city: 'New Delhi, Delhi' },
      HDFC0000101: { branchName: 'ANDHERI WEST', city: 'Mumbai, Maharashtra' },
      HDFC0000104: { branchName: 'NARIMAN POINT', city: 'Mumbai, Maharashtra' },
    },
  },
  PUNB: {
    bankName: 'Punjab National Bank',
    branches: {},
  },
  BARB: {
    bankName: 'Bank of Baroda',
    branches: {},
  },
};

function lookupIFSC(ifscCode: string) {
  // Try 4-letter prefix first, then 3-letter
  const prefix4 = ifscCode.substring(0, 4);
  const prefix3 = ifscCode.substring(0, 3);
  const bankData = bankPrefixes[prefix4] || bankPrefixes[prefix3];

  if (!bankData) {
    // For unknown prefixes, generate a generic response
    return {
      success: true as const,
      ifsc: ifscCode,
      bankName: `${prefix4} Bank`,
      branchName: ifscCode,
      city: 'India',
    };
  }

  const specificBranch = bankData.branches[ifscCode];
  return {
    success: true as const,
    ifsc: ifscCode,
    bankName: bankData.bankName,
    branchName: specificBranch?.branchName || ifscCode.substring(4),
    city: specificBranch?.city || 'India',
  };
}

export const ifscRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'mock'); })
  .get('/:code', (c) => {
    const code = c.req.param('code');
    return c.json(lookupIFSC(code));
  });
