
import { supabase } from "@/integrations/supabase/client";
import { getCategoryByKeyword } from "@/utils/categoryUtils";
import type { Transaction } from './types';

export const transactionMutationService = {
  async addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'> & { user_id?: string }): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to add a transaction');
    }
    
    if (!transaction.category || transaction.category === 'other') {
      const detectedCategory = getCategoryByKeyword(transaction.description);
      if (detectedCategory) {
        transaction.category = detectedCategory.id;
      }
    }
    
    if (transaction.category === 'Housing') transaction.category = 'housing';
    if (transaction.category === 'Transportation') transaction.category = 'transportation';
    
    const { is_recurring, recurrence_interval, ...transactionData } = transaction as any;
    
    console.log("Adding transaction:", { ...transactionData, user_id: user.id });
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transactionData,
        user_id: user.id
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
    
    return data as Transaction;
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    if (updates.category === 'Housing') updates.category = 'housing';
    if (updates.category === 'Transportation') updates.category = 'transportation';
    
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
    
    return data as Transaction;
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
};
