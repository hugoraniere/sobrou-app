import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/services/transactions';

export const useLinkedTransaction = (sourceId: string, sourceTable: string) => {
  return useQuery({
    queryKey: ['linked-transaction', sourceId, sourceTable],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('source_id', sourceId)
        .eq('source_table', sourceTable)
        .maybeSingle();

      if (error) throw error;
      return data as Transaction | null;
    },
    enabled: !!sourceId && !!sourceTable,
  });
};
