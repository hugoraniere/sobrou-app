import { supabase } from '@/integrations/supabase/client';
import type { Budget } from '@/types/mei';

export class BudgetService {
  static async getBudgets(year: number, month?: number): Promise<Budget[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year);

      if (month !== undefined) {
        query = query.eq('month', month);
      }

      const { data, error } = await query.order('month').order('category');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting budgets:', error);
      return [];
    }
  }

  static async upsertBudget(budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Budget> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('budgets')
        .upsert({
          user_id: user.id,
          ...budget
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting budget:', error);
      throw error;
    }
  }

  static async deleteBudget(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }
}
