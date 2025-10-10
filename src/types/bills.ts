
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
  // M7: Novos campos de parcelas
  installment_group_id?: string;
  installment_index?: number;
  installment_total?: number;
}

export interface CreateBillData {
  title: string;
  amount: number;
  due_date: string;
  description?: string;
  notes?: string;
  is_recurring?: boolean;
  recurrence_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  // M7: Suporte a parcelas
  is_installment?: boolean;
  installment_total?: number;
}

export interface UpdateBillData extends Partial<CreateBillData> {
  is_paid?: boolean;
  paid_date?: string;
  next_due_date?: string;
}

// M7: Template de contas
export interface BillTemplate {
  id: string;
  name: string;
  description?: string;
  default_amount: number;
  recurrence_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BillPeriodFilter = 'overdue' | 'today' | 'tomorrow' | 'this-week' | 'this-month' | 'all';
