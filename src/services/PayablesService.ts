import { supabase } from '@/integrations/supabase/client';
import { Payable } from '@/types/onboarding';

export class PayablesService {
  static async create(payableData: Omit<Payable, 'id' | 'created_at' | 'updated_at'>): Promise<Payable | null> {
    try {
      const { data, error } = await supabase
        .from('payables')
        .insert(payableData)
        .select()
        .single();

      if (error) throw error;
      return data as Payable;
    } catch (error) {
      console.error('Error creating payable:', error);
      return null;
    }
  }

  static async getByUser(userId: string): Promise<Payable[]> {
    try {
      const { data, error } = await supabase
        .from('payables')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return (data || []) as Payable[];
    } catch (error) {
      console.error('Error getting payables:', error);
      return [];
    }
  }

  static async getUpcoming(userId: string, limit = 3): Promise<Payable[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('payables')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'aberta')
        .gte('due_date', today)
        .order('due_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return (data || []) as Payable[];
    } catch (error) {
      console.error('Error getting upcoming payables:', error);
      return [];
    }
  }

  static async update(id: string, updates: Partial<Payable>): Promise<Payable | null> {
    try {
      const { data, error } = await supabase
        .from('payables')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Payable;
    } catch (error) {
      console.error('Error updating payable:', error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('payables')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting payable:', error);
      return false;
    }
  }

  static async markAsPaid(id: string): Promise<Payable | null> {
    return await this.update(id, {
      status: 'paga',
      // paid_date seria útil se tivéssemos esse campo
    });
  }
}