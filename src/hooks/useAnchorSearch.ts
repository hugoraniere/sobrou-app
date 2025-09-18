import { useState, useCallback, useEffect } from 'react';
import { AnchorService } from '@/services/AnchorService';
import type { OnboardingAnchor, AnchorSearchParams } from '@/types/onboarding-anchors';

interface UseAnchorSearchReturn {
  anchors: OnboardingAnchor[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  
  // Actions
  search: (params: AnchorSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  clear: () => void;
}

export function useAnchorSearch(): UseAnchorSearchReturn {
  const [anchors, setAnchors] = useState<OnboardingAnchor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastSearchParams, setLastSearchParams] = useState<AnchorSearchParams>({});

  const search = useCallback(async (params: AnchorSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await AnchorService.searchAnchors({
        ...params,
        offset: 0 // Reset offset for new search
      });

      setAnchors(result.anchors);
      setHasMore(result.hasMore);
      setTotal(result.total);
      setLastSearchParams(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na busca');
      setAnchors([]);
      setHasMore(false);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await AnchorService.searchAnchors({
        ...lastSearchParams,
        offset: anchors.length
      });

      setAnchors(prev => [...prev, ...result.anchors]);
      setHasMore(result.hasMore);
      setTotal(prev => Math.max(prev, result.total));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mais');
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, lastSearchParams, anchors.length]);

  const refresh = useCallback(async () => {
    await search(lastSearchParams);
  }, [search, lastSearchParams]);

  const clear = useCallback(() => {
    setAnchors([]);
    setError(null);
    setHasMore(false);
    setTotal(0);
    setLastSearchParams({});
  }, []);

  return {
    anchors,
    loading,
    error,
    hasMore,
    total,
    search,
    loadMore,
    refresh,
    clear
  };
}