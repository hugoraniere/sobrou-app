
import { supabase } from "@/integrations/supabase/client";
import { getCategoryByKeyword } from "@/data/categories";
import type { Transaction } from "@/types/component-types";

export { Transaction };

export interface ParsedExpense {
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
  isSaving: boolean;
  savingGoal: string | null;
}

export const TransactionService = {
  // Parse expense text using the edge function
  async parseExpenseText(text: string): Promise<ParsedExpense> {
    try {
      console.log("Enviando texto para a função parse-expense:", text);
      // Use hardcoded URL instead of process.env
      const response = await fetch('https://jevsazpwfowhmjupuuzw.supabase.co/functions/v1/parse-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldnNhenB3Zm93aG1qdXB1dXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njg5MjcsImV4cCI6MjA1OTM0NDkyN30.ZvIahA6EAPrVKSEUoRXDFJn6LeyqF-7_QM-Qv5O8Pn8'
        },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Parse expense error response:', errorData);
        throw new Error(`Failed to parse expense text: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Parsed expense data:", data);
      
      // Try to determine category based on keywords if not provided
      if (!data.category || data.category === 'Other') {
        const detectedCategory = getCategoryByKeyword(data.description);
        if (detectedCategory) {
          data.category = detectedCategory.id;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error parsing expense text:', error);
      throw error;
    }
  },
  
  // Get all transactions for the current user
  async getTransactions(): Promise<Transaction[]> {
    console.log('Buscando transações do usuário...');
    
    try {
      // Verifica se o usuário está autenticado
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
  
  // Add a new transaction
  async addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'> & { user_id?: string }): Promise<Transaction> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to add a transaction');
    }
    
    // Try to determine category based on keywords if not provided
    if (!transaction.category || transaction.category === 'other') {
      const detectedCategory = getCategoryByKeyword(transaction.description);
      if (detectedCategory) {
        transaction.category = detectedCategory.id;
      }
    }
    
    // Handle English category names by mapping to the equivalent in our system
    if (transaction.category === 'Housing') transaction.category = 'housing';
    if (transaction.category === 'Transportation') transaction.category = 'transportation';
    
    // Remove the fields that don't exist in the database schema
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
  
  // Get transactions by date range
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
  },
  
  // Update a transaction
  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    // Handle English category names by mapping to the equivalent in our system
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

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
  
  // Get summary stats for a given date range
  async getTransactionSummary(startDate: string, endDate: string) {
    const transactions = await this.getTransactionsByDateRange(startDate, endDate);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netBalance = totalIncome - totalExpenses;
    
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
      
    return {
      totalIncome,
      totalExpenses,
      netBalance,
      expensesByCategory
    };
  }
};
