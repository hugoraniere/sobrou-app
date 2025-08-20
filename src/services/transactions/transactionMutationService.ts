
import { Transaction } from './types';
import { supabase } from '@/integrations/supabase/client';

// Sanitize transaction data before sending to Supabase
const sanitizeTransactionData = (transactionData: Partial<Transaction>): any => {
  const sanitized: any = { ...transactionData };
  
  // Remove UI-only fields that don't exist in Supabase
  delete sanitized.repeat_forever;
  
  // Convert empty strings to null for database fields
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === '') {
      sanitized[key] = null;
    }
  });
  
  // If is_recurring is false, clear all recurrence-related fields
  if (sanitized.is_recurring === false) {
    sanitized.recurrence_frequency = null;
    sanitized.next_due_date = null;
    sanitized.recurrence_end_date = null;
    sanitized.installment_total = null;
    sanitized.installment_index = null;
  }
  
  return sanitized;
};

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

      // SAFEGUARD: Normalizar categoria para garantir compatibilidade com DB
      const validCategories = [
        'alimentacao', 'moradia', 'transporte', 'internet', 'cartao',
        'saude', 'lazer', 'compras', 'investimentos', 'familia', 'doacoes', 'outros'
      ];
      
      let normalizedCategory = transactionData.category?.toLowerCase() || 'outros';
      
      // Mapear "other" para "outros"
      if (normalizedCategory === 'other') {
        normalizedCategory = 'outros';
      }
      
      // Se não for uma categoria válida, usar "outros"
      if (!validCategories.includes(normalizedCategory)) {
        normalizedCategory = 'outros';
      }
      
      console.log(`Final category before insertion: ${normalizedCategory} (original: ${transactionData.category})`);

      const newTransaction = {
        user_id: user.id,
        amount: transactionData.amount,
        category: normalizedCategory, // Usar categoria normalizada
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

      // Sanitize data before sending to Supabase
      const sanitizedData = sanitizeTransactionData(transactionData);
      
      const { data, error } = await supabase
        .from('transactions')
        .update(sanitizedData)
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
