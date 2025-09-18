import { useState, useCallback } from 'react';
import { AnchorReindexService } from '@/services/AnchorReindexService';
import { AnchorMaintenanceService } from '@/services/AnchorMaintenanceService';
import { AnchorReindexProgress } from '@/types/anchor-maintenance';

interface UseAnchorReindexProps {
  route?: string;
  onComplete?: (progress: AnchorReindexProgress) => void;
}

export const useAnchorReindex = ({
  route,
  onComplete
}: UseAnchorReindexProps = {}) => {
  const [progress, setProgress] = useState<AnchorReindexProgress>({
    total: 0,
    current: 0,
    status: 'idle',
    errors: [],
    updated: 0,
    created: 0,
    invalid: 0
  });

  const [isReindexing, setIsReindexing] = useState(false);

  const startReindex = useCallback(async (targetRoute?: string) => {
    if (isReindexing) return;

    const routeToUse = targetRoute || route || window.location.pathname;
    setIsReindexing(true);

    try {
      // Track event
      await AnchorMaintenanceService.getInstance().trackEvent({
        type: 'anchors_reindexed',
        route: routeToUse,
        timestamp: Date.now()
      });

      const reindexService = AnchorReindexService.getInstance();
      const finalProgress = await reindexService.reindexRouteAnchors(
        routeToUse,
        setProgress
      );

      onComplete?.(finalProgress);

    } catch (error) {
      console.error('Reindex failed:', error);
      setProgress(prev => ({
        ...prev,
        status: 'error',
        errors: [...prev.errors, `Falha na reindexação: ${error}`]
      }));
    } finally {
      setIsReindexing(false);
    }
  }, [route, isReindexing, onComplete]);

  const resetProgress = useCallback(() => {
    setProgress({
      total: 0,
      current: 0,
      status: 'idle',
      errors: [],
      updated: 0,
      created: 0,
      invalid: 0
    });
  }, []);

  const getProgressPercentage = useCallback(() => {
    if (progress.total === 0) return 0;
    return Math.round((progress.current / progress.total) * 100);
  }, [progress]);

  const getStatusMessage = useCallback(() => {
    switch (progress.status) {
      case 'scanning':
        return 'Escaneando elementos na página...';
      case 'processing':
        return progress.currentAnchor 
          ? `Processando: ${progress.currentAnchor}`
          : `Processando âncoras... (${progress.current}/${progress.total})`;
      case 'completed':
        return `Concluído! ${progress.updated} atualizadas, ${progress.created} criadas, ${progress.invalid} inválidas`;
      case 'error':
        return 'Erro durante reindexação';
      default:
        return 'Pronto para reindexar';
    }
  }, [progress]);

  return {
    progress,
    isReindexing,
    startReindex,
    resetProgress,
    getProgressPercentage,
    getStatusMessage
  };
};