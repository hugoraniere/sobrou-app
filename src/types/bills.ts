
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
  created_at: string;
  updated_at: string;
}

export interface CreateBillData {
  title: string;
  amount: number;
  due_date: string;
  description?: string;
  notes?: string;
}

export interface UpdateBillData extends Partial<CreateBillData> {
  is_paid?: boolean;
  paid_date?: string;
}
