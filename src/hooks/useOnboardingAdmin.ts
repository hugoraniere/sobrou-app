import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Performance optimization hook for onboarding admin
export const useOnboardingAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced save to prevent excessive API calls
  const debouncedSave = useCallback(
    debounce(async (saveFunction: () => Promise<void>) => {
      setLoading(true);
      setError(null);
      try {
        await saveFunction();
        toast.success('Configuração salva com sucesso');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Optimistic updates for better UX
  const optimisticUpdate = useCallback(
    <T>(
      currentData: T,
      updateFunction: (data: T) => T,
      saveFunction: () => Promise<void>
    ) => {
      const optimisticData = updateFunction(currentData);
      
      // Apply optimistic update immediately
      return optimisticData;
    },
    []
  );

  // Batch operations for better performance
  const batchOperation = useCallback(
    async (operations: (() => Promise<void>)[]) => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all(operations.map(op => op()));
        toast.success('Operações concluídas');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro nas operações';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    debouncedSave,
    optimisticUpdate,
    batchOperation
  };
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Performance monitoring for large lists
export const useVirtualization = <T>(
  items: T[],
  itemHeight: number = 60,
  containerHeight: number = 400
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemsCount + 1, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;
  
  return {
    visibleItems,
    offsetY,
    totalHeight,
    startIndex,
    endIndex,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};

// Memoization helper for complex calculations
export const useMemoizedCalculation = <T, R>(
  data: T,
  calculationFn: (data: T) => R,
  deps: any[] = []
) => {
  const [result, setResult] = useState<R>();
  
  useEffect(() => {
    const newResult = calculationFn(data);
    setResult(newResult);
  }, [data, ...deps]);
  
  return result;
};