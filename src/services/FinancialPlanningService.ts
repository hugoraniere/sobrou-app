
import { Transaction } from '@/types/component-types';
import { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface FinancialPlanningStats {
  availableToday: number;
  availableThisWeek: number;
  availableThisMonth: number;
  hasRisk: boolean;
  totalIncome: number;
  totalExpenses: number;
  recurringExpenses: number;
  savingsGoalAmount: number;
}

export const FinancialPlanningService = {
  calculateAvailableAmount(
    transactions: Transaction[],
    savingsGoalAmount: number = 0
  ): FinancialPlanningStats {
    const now = new Date();
    const today = startOfDay(now);
    const endToday = endOfDay(now);
    const startWeek = startOfWeek(now, { locale: ptBR });
    const endWeek = endOfWeek(now, { locale: ptBR });
    const startMonth = startOfMonth(now);
    const endMonth = endOfMonth(now);

    const income = transactions
      .filter(t => t.type === 'income' && new Date(t.date) <= endMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) <= now)
      .reduce((sum, t) => sum + t.amount, 0);

    const recurringExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.is_recurring && 
        t.next_due_date && 
        new Date(t.next_due_date) <= endMonth &&
        new Date(t.next_due_date) > now
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const totalAvailable = income - expenses - recurringExpenses - savingsGoalAmount;
    const daysRemainingInMonth = endMonth.getDate() - now.getDate() + 1;
    const daysRemainingInWeek = 7 - now.getDay();

    const dailyAmount = totalAvailable / daysRemainingInMonth;
    const weeklyAmount = dailyAmount * daysRemainingInWeek;
    const monthlyAmount = totalAvailable;

    return {
      availableToday: Math.max(0, dailyAmount),
      availableThisWeek: Math.max(0, weeklyAmount),
      availableThisMonth: Math.max(0, monthlyAmount),
      hasRisk: totalAvailable < 0,
      totalIncome: income,
      totalExpenses: expenses,
      recurringExpenses: recurringExpenses,
      savingsGoalAmount
    };
  }
};
