
import { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  title: string;
  description: string;
  category: 'warning' | 'opportunity' | 'pattern' | 'suggestion' | 'achievement';
  priority: number;
}

export function useFinancialInsights(transactions: Transaction[]) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    if (!transactions.length) {
      setInsights([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { transactions }
      });

      if (error) throw new Error(error.message);
      
      if (data?.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      } else {
        console.error('Invalid response format:', data);
        setInsights([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch insights';
      console.error('Error fetching insights:', errorMessage);
      setError(errorMessage);
      setInsights([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      fetchInsights();
    }
  }, [transactions.length]); // Only re-fetch when transaction count changes

  return {
    insights,
    isLoading,
    error,
    refreshInsights: fetchInsights
  };
}
