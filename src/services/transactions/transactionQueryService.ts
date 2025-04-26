
import { Transaction } from './types';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths } from 'date-fns';

export const transactionQueryService = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async getTransactionsByDateRange(
    startDate: string,
    endDate: string = format(new Date(), 'yyyy-MM-dd')
  ): Promise<Transaction[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  }
};
