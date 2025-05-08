
import { Transaction } from './types';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths } from 'date-fns';

// Função auxiliar para validar e converter o tipo da transação
const validateTransactionType = (type: string): "income" | "expense" | "transfer" => {
  if (type === 'income' || type === 'expense' || type === 'transfer') {
    return type;
  }
  // Valor padrão caso receba um tipo inválido
  console.warn(`Tipo de transação inválido detectado: ${type}, convertendo para 'expense'`);
  return 'expense';
};

// Função auxiliar para converter dados do Supabase para o tipo Transaction
const mapToTransaction = (rawData: any): Transaction => {
  return {
    ...rawData,
    type: validateTransactionType(rawData.type),
    // Garantir que outros campos opcionais estejam corretamente tipados
    is_recurring: Boolean(rawData.is_recurring),
    recurrence_frequency: rawData.recurrence_frequency || undefined,
    next_due_date: rawData.next_due_date || undefined
  };
};

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
      
      // Converter dados para o tipo Transaction
      return data ? data.map(mapToTransaction) : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Garantir que o erro é propagado para ser tratado
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
      
      // Converter dados para o tipo Transaction
      return data ? data.map(mapToTransaction) : [];
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      // Garantir que o erro é propagado para ser tratado
      throw error;
    }
  }
};
