
import { Transaction } from '@/services/transactions';

export interface CategoryTotal {
  category: string;
  displayName: string;
  amount: number;
  transactions: Transaction[];
}

export interface MonthData {
  month: number;
  revenue: CategoryTotal[];
  essentialExpenses: CategoryTotal[];
  nonEssentialExpenses: CategoryTotal[];
  monthlyReserves: CategoryTotal[];
  monthlySurplus: number;
  totalRevenue: number;
  totalEssentialExpenses: number;
  totalNonEssentialExpenses: number;
  totalReserves: number;
}

export interface MonthlySummaryData {
  year: number;
  months: MonthData[];
}

export const MONTHS_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];
