
export interface BillTransaction {
  id: string;
  bill_id: string;
  user_id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  transaction_date: string;
  created_at: string;
}

export interface CreateBillTransactionData {
  bill_id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  transaction_date?: string;
}

export interface BillWithBalance {
  id: string;
  title: string;
  amount: number;
  current_balance: number;
  transactions_total: number;
  has_transactions: boolean;
}
