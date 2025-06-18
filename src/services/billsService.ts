
import { supabase } from "@/integrations/supabase/client";
import { Bill, CreateBillData, UpdateBillData } from "@/types/bills";

export const billsService = {
  async getBills(): Promise<Bill[]> {
    const { data, error } = await supabase
      .from('bills_to_pay')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }

    return data || [];
  },

  async createBill(billData: CreateBillData): Promise<Bill> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bills_to_pay')
      .insert([{
        ...billData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating bill:', error);
      throw error;
    }

    return data;
  },

  async updateBill(id: string, updateData: UpdateBillData): Promise<Bill> {
    const { data, error } = await supabase
      .from('bills_to_pay')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating bill:', error);
      throw error;
    }

    return data;
  },

  async deleteBill(id: string): Promise<void> {
    const { error } = await supabase
      .from('bills_to_pay')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  },

  async markAsPaid(id: string): Promise<Bill> {
    return this.updateBill(id, {
      is_paid: true,
      paid_date: new Date().toISOString().split('T')[0]
    });
  },

  async markAsUnpaid(id: string): Promise<Bill> {
    return this.updateBill(id, {
      is_paid: false,
      paid_date: undefined
    });
  }
};
