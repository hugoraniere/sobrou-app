import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryTotal {
  category: string;
  total: number;
}

export const useRealTransactionsData = (
  year: number,
  month: number,
  useCompetenceDate: boolean
) => {
  return useQuery({
    queryKey: ['real-transactions', year, month, useCompetenceDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const dateField = useCompetenceDate ? 'competence_date' : 'date';

      const { data, error } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('user_id', user.id)
        .gte(dateField, startDate.toISOString().split('T')[0])
        .lte(dateField, endDate.toISOString().split('T')[0]);

      if (error) throw error;

      // Agregar por categoria
      const categoryTotals = (data || []).reduce((acc, transaction) => {
        const category = transaction.category || 'outros';
        acc[category] = (acc[category] || 0) + Number(transaction.amount);
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(categoryTotals).map(([category, total]) => ({
        category,
        total,
      }));
    },
  });
};
