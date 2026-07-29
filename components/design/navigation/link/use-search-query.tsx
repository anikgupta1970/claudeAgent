import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

/**
 * A custom hook that parses the URL query string and returns a URLSearchParams object.
 * This provides a convenient way to read query parameters from the URL.
 * @returns An instance of URLSearchParams based on the current location's search string.
 * @example
 * const query = useSearchQuery();
 * const page = query.get('page');
 */
export function useSearchQuery(): URLSearchParams {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}