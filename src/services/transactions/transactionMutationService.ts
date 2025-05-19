
import { Transaction } from './types';
import { supabase } from '@/integrations/supabase/client';

export const transactionMutationService = {
  async addTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Garantir que os campos obrigatórios estão presentes
      if (!transactionData.amount || !transactionData.category || !transactionData.description || !transactionData.type) {
        throw new Error('Campos obrigatórios ausentes');
      }

      // Preservar o texto original da descrição
      const originalDescription = transactionData.description;

      const newTransaction = {
        user_id: user.id,
        amount: transactionData.amount,
        category: transactionData.category,
        description: originalDescription, // Garantindo que o texto original é salvo
        type: transactionData.type,
        date: transactionData.date || new Date().toISOString().split('T')[0],
        is_recurring: transactionData.is_recurring || false,
        recurrence_frequency: transactionData.recurrence_frequency,
        next_due_date: transactionData.next_due_date
      };
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(newTransaction)
        .select()
        .single();
      
      if (error) throw error;
      return data as Transaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  async updateTransaction(
    id: string,
    transactionData: Partial<Transaction>
  ): Promise<Transaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Transaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
};
