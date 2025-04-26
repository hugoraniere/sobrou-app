
import type { Database } from "@/integrations/supabase/types";

export type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface ParsedExpense {
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
  isSaving: boolean;
  savingGoal: string | null;
}

