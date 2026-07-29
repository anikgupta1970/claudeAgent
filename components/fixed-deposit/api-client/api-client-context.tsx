// React Context for API Client

import React, { createContext, useContext, useMemo } from 'react';
import type { ApiClient, ApiClientConfig } from './types.js';
import { createApiClient } from './api-client.js';

const ApiClientContext = createContext<ApiClient | null>(null);

export interface ApiClientProviderProps {
  children: React.ReactNode;
  config?: ApiClientConfig;
}

export function ApiClientProvider({ children, config }: ApiClientProviderProps) {
  const client = useMemo(() => createApiClient(config), [config]);

  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
}

export function useApiClient(): ApiClient {
  const client = useContext(ApiClientContext);

  if (!client) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }

  return client;
}

// Optional hook that returns null instead of throwing if no provider
export function useApiClientOptional(): ApiClient | null {
  return useContext(ApiClientContext);
}

// Hook that returns the context client or creates a default real client
// This allows components to work both with and without a provider
export function useApiClientWithFallback(fallbackConfig?: ApiClientConfig): ApiClient {
  const contextClient = useContext(ApiClientContext);
  const fallbackClient = useMemo(
    () => createApiClient(fallbackConfig),
    [fallbackConfig]
  );

  return contextClient ?? fallbackClient;
}
