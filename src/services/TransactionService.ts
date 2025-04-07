
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  type: 'expense' | 'income';
  date: string;
  created_at: string;
  is_recurring?: boolean;
  recurrence_interval?: string;
}

export interface ParsedExpense {
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
  isSaving: boolean;
  savingGoal: string | null;
  is_recurring?: boolean;
  recurrence_interval?: string;
}

export const TransactionService = {
  // Parse expense text using the edge function
  async parseExpenseText(text: string): Promise<ParsedExpense> {
    try {
      console.log("Sending text to parse-expense function:", text);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jevsazpwfowhmjupuuzw.supabase.co'}/functions/v1/parse-expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpldnNhenB3Zm93aG1qdXB1dXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njg5MjcsImV4cCI6MjA1OTM0NDkyN30.ZvIahA6EAPrVKSEUoRXDFJn6LeyqF-7_QM-Qv5O8Pn8'}`
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
      return data;
    } catch (error) {
      console.error('Error parsing expense text:', error);
      throw error;
    }
  },
  
  // Get all transactions for the current user
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data as Transaction[] || [];
  },
  
  // Add a new transaction
  async addTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<Transaction> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to add a transaction');
    }
    
    console.log("Adding transaction:", { ...transaction, user_id: user.id });
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
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
  
  // Update a transaction (for marking as recurring)
  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
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
