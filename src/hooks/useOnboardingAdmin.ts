import { useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';

// Debounced save hook for admin performance
export function useOnboardingAdmin() {
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSave = useCallback(async (saveFunction: () => Promise<void>) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveFunction();
        toast.success('Configuração salva automaticamente');
      } catch (error) {
        toast.error('Erro ao salvar configuração');
        console.error('Save error:', error);
      }
    }, 1000); // 1 second debounce
  }, []);

  return { debouncedSave };
}

// Virtualization hook for large lists
export function useVirtualization(items: any[], itemHeight: number = 80) {
  const virtualizedItems = useMemo(() => {
    if (items.length <= 20) return items; // No virtualization for small lists
    
    // Simple virtualization - in production, use react-window
    return items.slice(0, 50); // Show first 50 items
  }, [items]);

  return { virtualizedItems };
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef(Date.now());

  const trackRender = useCallback(() => {
    const renderTime = Date.now() - startTime.current;
    if (renderTime > 100) { // Log slow renders (>100ms)
      console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`);
    }
  }, [componentName]);

  return { trackRender };
}