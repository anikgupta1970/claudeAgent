/**
 * React Context for Stitch API Client
 *
 * Provides the Stitch client via React Context for use throughout the app.
 */

import React, { createContext, useContext, useMemo } from 'react';
import type { StitchClient, StitchClientConfig } from './stitch-client.js';
import { createStitchClient } from './stitch-client.js';
import { createMockStitchClient } from './mock-stitch-client.js';

const StitchClientContext = createContext<StitchClient | null>(null);

export interface StitchClientProviderProps {
  children: React.ReactNode;
  config?: StitchClientConfig;
  /** When true, uses a mock client that returns hardcoded data instead of making HTTP calls */
  mock?: boolean;
}

/**
 * Provider component that creates and provides a Stitch client instance
 */
export function StitchClientProvider({ children, config, mock }: StitchClientProviderProps) {
  const client = useMemo(
    () => mock ? createMockStitchClient() : createStitchClient(config),
    [config, mock]
  );

  return (
    <StitchClientContext.Provider value={client}>
      {children}
    </StitchClientContext.Provider>
  );
}

/**
 * Hook to access the Stitch client from context
 * @throws Error if used outside of StitchClientProvider
 */
export function useStitchClient(): StitchClient {
  const client = useContext(StitchClientContext);

  if (!client) {
    throw new Error('useStitchClient must be used within a StitchClientProvider');
  }

  return client;
}

/**
 * Optional hook that returns null instead of throwing if no provider
 */
export function useStitchClientOptional(): StitchClient | null {
  return useContext(StitchClientContext);
}

/**
 * Hook that returns the context client or creates a default client as fallback.
 * This allows components to work both with and without a provider.
 */
export function useStitchClientWithFallback(fallbackConfig?: StitchClientConfig): StitchClient {
  const contextClient = useContext(StitchClientContext);
  const fallbackClient = useMemo(
    () => createStitchClient(fallbackConfig),
    [fallbackConfig]
  );

  return contextClient ?? fallbackClient;
}
