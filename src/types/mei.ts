export interface MEISettings {
  id: string;
  user_id: string;
  tax_reserve_percentage: number;
  annual_limit: number;
  created_at: string;
  updated_at: string;
}

export interface MEIDashboardData {
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  taxReserve: number;
  upcomingPayments: {
    count: number;
    total: number;
  };
  annualProgress: {
    current: number;
    limit: number;
    percentage: number;
  };
}

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

export interface MonthlyBudgetSummary {
  category: string;
  planned: number;
  real: number;
  variationAmount: number;
  variationPercentage: number;
}
