
import { useState, useEffect, useCallback } from 'react';
import { SavingGoal, SavingsService } from '@/services/SavingsService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useSavingGoals = () => {
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  const fetchSavingGoals = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const goals = await SavingsService.getSavingGoals();
      setSavingGoals(goals);
    } catch (err) {
      console.error('Erro ao buscar metas de economia:', err);
      setError(err as Error);
      toast.error('Erro ao carregar metas de economia');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    fetchSavingGoals();
  }, [fetchSavingGoals]);
  
  const refetchGoals = useCallback(() => {
    setIsLoading(true);
    fetchSavingGoals();
  }, [fetchSavingGoals]);
  
  return {
    savingGoals,
    isLoading,
    error,
    refetchGoals
  };
};
