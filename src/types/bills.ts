
export interface Bill {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  due_date: string;
  description?: string;
  notes?: string;
  is_paid: boolean;
  paid_date?: string;
  is_recurring: boolean;
  recurrence_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBillData {
  title: string;
  amount: number;
  due_date: string;
  description?: string;
  notes?: string;
  is_recurring?: boolean;
  recurrence_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface UpdateBillData extends Partial<CreateBillData> {
  is_paid?: boolean;
  paid_date?: string;
  next_due_date?: string;
}

export type BillPeriodFilter = 'overdue' | 'today' | 'tomorrow' | 'this-week' | 'this-month' | 'all';
