
import { Transaction } from './types';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths } from 'date-fns';

export const transactionQueryService = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      // Verificar se o usuário está autenticado antes de buscar as transações
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', authError.message);
        throw new Error('Authentication failed');
      }
      
      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }
      
      // Adicionar logs para debug
      console.log('Fetching transactions for user:', user.id);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error.message);
        throw error;
      }
      
      // Adicionar logs para debug
      console.log('Transactions fetched:', data?.length || 0);
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', authError.message);
        throw new Error('Authentication failed');
      }
      
      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }
      
      console.log(`Fetching transactions from ${startDate} to ${endDate} for user ${user.id}`);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error.message);
        throw error;
      }
      
      console.log('Transactions fetched for date range:', data?.length || 0);
      return data as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  }
};
