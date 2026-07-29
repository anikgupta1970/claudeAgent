import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useStitchClientWithFallback } from '@api-banking/stitch.stitch-client';
import type { StitchBranch } from '@api-banking/stitch.stitch-client';
import type { Branch, BranchFilterParams } from './branch-selector-base.js';

export interface BranchesContextValue {
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
  fetchBranches: (params?: BranchFilterParams) => Promise<void>;
}

const BranchesContext = createContext<BranchesContextValue | null>(null);

export interface BranchesProviderProps {
  children: React.ReactNode;
}

export function BranchesProvider({ children }: BranchesProviderProps) {
  const stitchClient = useStitchClientWithFallback();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async (params?: BranchFilterParams) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (params?.pin) {
        response = await stitchClient.getBranchesByPincode({ country: 'IN', postalCode: params.pin });
      } else if (params?.state && params?.city) {
        response = await stitchClient.getBranchesByLocation({ country: 'IN', state: params.state, city: params.city });
      } else {
        setBranches([]);
        setIsLoading(false);
        return;
      }

      if ('success' in response && !response.success) {
        setError(response.errors[0]?.message || 'Failed to fetch branches');
      } else {
        const stitchBranches = response as StitchBranch[];
        setBranches(stitchBranches.map(b => ({
          code: b.code,
          ifsc: b.ifsc,
          name: b.name,
          address: b.address,
        })));
      }
    } catch (err) {
      setError('An error occurred while fetching branches');
    } finally {
      setIsLoading(false);
    }
  }, [stitchClient]);

  const value = useMemo(() => ({
    branches,
    isLoading,
    error,
    fetchBranches,
  }), [branches, isLoading, error, fetchBranches]);

  return (
    <BranchesContext.Provider value={value}>
      {children}
    </BranchesContext.Provider>
  );
}

export function useBranches(): BranchesContextValue {
  const context = useContext(BranchesContext);

  if (!context) {
    throw new Error('useBranches must be used within a BranchesProvider');
  }

  return context;
}

export function useBranchesOptional(): BranchesContextValue | null {
  return useContext(BranchesContext);
}
