import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

// Optimized query hook with intelligent caching
export function useOptimizedQuery<T>(
  key: string | string[],
  queryFn: () => Promise<T>,
  options: Partial<UseQueryOptions<T, Error>> = {}
) {
  const queryKey = Array.isArray(key) ? key : [key];
  const memoizedKey = useMemo(() => queryKey, [JSON.stringify(queryKey)]);
  
  return useQuery({
    queryKey: memoizedKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
    ...options
  });
}