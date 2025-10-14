import { supabase } from '@/integrations/supabase/client';

export interface Budget {
  id: string;
  user_id: string;
  year: number;
  month: number;
  category: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export const budgetService = {
  async list(year: number, userId: string): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .order('month', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async upsert(budget: Partial<Budget>): Promise<Budget> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const budgetData: any = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (budget.id) budgetData.id = budget.id;
    if (budget.year !== undefined) budgetData.year = budget.year;
    if (budget.month !== undefined) budgetData.month = budget.month;
    if (budget.category) budgetData.category = budget.category;
    if (budget.amount !== undefined) budgetData.amount = budget.amount;
    if (budget.created_at) budgetData.created_at = budget.created_at;

    const { data, error } = await supabase
      .from('budgets')
      .upsert(budgetData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async bulkUpsert(budgets: Partial<Budget>[]): Promise<Budget[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const budgetsWithUser = budgets.map(b => ({
      id: b.id,
      year: b.year!,
      month: b.month!,
      category: b.category!,
      amount: b.amount || 0,
      user_id: user.id,
      created_at: b.created_at,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('budgets')
      .upsert(budgetsWithUser)
      .select();

    if (error) throw error;
    return data || [];
  },
};
