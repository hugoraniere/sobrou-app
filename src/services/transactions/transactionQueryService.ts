
import { supabase } from "@/integrations/supabase/client";
import type { Transaction } from './types';

export const transactionQueryService = {
  async getTransactions(): Promise<Transaction[]> {
    console.log('Buscando transações do usuário...');
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Erro de autenticação ao buscar transações:', authError);
        throw new Error('Erro de autenticação: ' + authError.message);
      }
      
      if (!user) {
        console.warn('Usuário não está autenticado ao buscar transações');
        return [];
      }
      
      console.log('Usuário autenticado, buscando transações...');
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) {
        console.error('Erro ao buscar transações do banco de dados:', error);
        throw error;
      }
      
      console.log(`Transações recuperadas: ${data?.length || 0}`);
      return data as Transaction[] || [];
    } catch (error) {
      console.error('Erro completo ao buscar transações:', error);
      throw error;
    }
  },

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
    
    return data as Transaction[] || [];
  }
};

