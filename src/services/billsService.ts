import { supabase } from "@/integrations/supabase/client";
import { Bill, CreateBillData, UpdateBillData } from "@/types/bills";
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

const calculateNextDueDate = (currentDate: string, frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'): string => {
  const date = new Date(currentDate);
  
  switch (frequency) {
    case 'daily':
      return addDays(date, 1).toISOString().split('T')[0];
    case 'weekly':
      return addWeeks(date, 1).toISOString().split('T')[0];
    case 'monthly':
      return addMonths(date, 1).toISOString().split('T')[0];
    case 'yearly':
      return addYears(date, 1).toISOString().split('T')[0];
    default:
      return addMonths(date, 1).toISOString().split('T')[0];
  }
};

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

    return (data || []).map(bill => ({
      ...bill,
      recurrence_frequency: bill.recurrence_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly'
    }));
  },

  async createBill(billData: CreateBillData): Promise<Bill> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const nextDueDate = billData.is_recurring && billData.recurrence_frequency
      ? calculateNextDueDate(billData.due_date, billData.recurrence_frequency)
      : null;

    const { data, error } = await supabase
      .from('bills_to_pay')
      .insert([{
        ...billData,
        user_id: user.id,
        is_recurring: billData.is_recurring || false,
        recurrence_frequency: billData.recurrence_frequency || 'monthly',
        next_due_date: nextDueDate
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating bill:', error);
      throw error;
    }

    return {
      ...data,
      recurrence_frequency: data.recurrence_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly'
    };
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

    return {
      ...data,
      recurrence_frequency: data.recurrence_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly'
    };
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Buscar a conta atual
    const { data: bill, error: fetchError } = await supabase
      .from('bills_to_pay')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching bill:', fetchError);
      throw fetchError;
    }

    // M5: Criar transação vinculada
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'expense',
        amount: bill.amount,
        category: 'outros',
        description: `Pagamento: ${bill.title}`,
        date: new Date().toISOString().split('T')[0],
        competence_date: bill.due_date,
        status: 'paid',
        source_id: id,
        source_table: 'bills_to_pay'
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }

    // Marcar como paga
    const { data: updatedBill, error: updateError } = await supabase
      .from('bills_to_pay')
      .update({
        is_paid: true,
        paid_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating bill:', updateError);
      throw updateError;
    }

    // Se for recorrente, criar a próxima conta
    if (bill.is_recurring && bill.next_due_date) {
      const nextDueDate = calculateNextDueDate(
        bill.next_due_date, 
        bill.recurrence_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly'
      );
      
      await billsService.createBill({
        title: bill.title,
        amount: bill.amount,
        due_date: bill.next_due_date,
        description: bill.description,
        notes: bill.notes,
        is_recurring: true,
        recurrence_frequency: bill.recurrence_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
      });
    }

    return {
      ...updatedBill,
      recurrence_frequency: updatedBill.recurrence_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly'
    };
  },

  async markAsUnpaid(id: string): Promise<Bill> {
    // M5: Deletar transação vinculada
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('source_id', id)
      .eq('source_table', 'bills_to_pay');

    if (deleteError) {
      console.error('Error deleting transaction:', deleteError);
      throw deleteError;
    }

    const { data, error } = await supabase
      .from('bills_to_pay')
      .update({
        is_paid: false,
        paid_date: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error marking bill as unpaid:', error);
      throw error;
    }

    return {
      ...data,
      recurrence_frequency: data.recurrence_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly'
    };
  }
};
