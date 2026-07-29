import { app, run } from './api.app-root.js';

export { run };

// Re-export app as default
export default {
  run,
  app,
};

// Export app type for RPC client usage
// Usage: import { hc } from 'hono/client';
//        const client = hc<AppType>('http://localhost:3000');
export type AppType = typeof app;

// Re-export types for consumers
export * from './types/index.js';

// Re-export schemas for validation
export * from './schemas/index.js';
