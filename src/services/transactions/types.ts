
import type { Database } from "@/integrations/supabase/types";

export type Transaction = {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  amount: number;
  is_recurring?: boolean;
  user_id: string;
  created_at: string;
  next_due_date?: string;
  recurrence_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrence_end_date?: string;
  installment_total?: number;
  installment_index?: number;
};

export interface ParsedExpense {
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
  isSaving: boolean;
  savingGoal: string | null;
}
