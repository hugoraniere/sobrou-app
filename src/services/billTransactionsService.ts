
import { supabase } from "@/integrations/supabase/client";
import { BillTransaction, CreateBillTransactionData } from "@/types/billTransactions";

export const billTransactionsService = {
  async getBillTransactions(billId: string): Promise<BillTransaction[]> {
    const { data, error } = await supabase
      .from('bill_transactions')
      .select('*')
      .eq('bill_id', billId)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bill transactions:', error);
      throw error;
    }

    // Type assertion para garantir que o tipo está correto
    return (data || []) as BillTransaction[];
  },

  async createBillTransaction(transactionData: CreateBillTransactionData): Promise<BillTransaction> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bill_transactions')
      .insert([{
        ...transactionData,
        user_id: user.id,
        transaction_date: transactionData.transaction_date || new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating bill transaction:', error);
      throw error;
    }

    // Type assertion para garantir que o tipo está correto
    return data as BillTransaction;
  },

  async deleteBillTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('bill_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting bill transaction:', error);
      throw error;
    }
  },

  async calculateBillBalance(billId: string, originalAmount: number): Promise<{ current_balance: number; transactions_total: number }> {
    const { data, error } = await supabase
      .from('bill_transactions')
      .select('amount, type')
      .eq('bill_id', billId);

    if (error) {
      console.error('Error calculating bill balance:', error);
      throw error;
    }

    const transactions = data || [];
    const transactionsTotal = transactions.reduce((total, transaction) => {
      return transaction.type === 'debit' 
        ? total - transaction.amount 
        : total + transaction.amount;
    }, 0);

    const currentBalance = originalAmount + transactionsTotal;

    return {
      current_balance: currentBalance,
      transactions_total: transactionsTotal
    };
  }
};
