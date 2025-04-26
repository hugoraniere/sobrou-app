
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

interface DateRange {
  start: Date;
  end: Date;
}

const calculateDateRanges = (now: Date): { today: DateRange; week: DateRange; month: DateRange } => {
  return {
    today: {
      start: startOfDay(now),
      end: endOfDay(now)
    },
    week: {
      start: startOfWeek(now, { locale: ptBR }),
      end: endOfWeek(now, { locale: ptBR })
    },
    month: {
      start: startOfMonth(now),
      end: endOfMonth(now)
    }
  };
};

const calculateTotalIncome = (transactions: Transaction[], endDate: Date): number => {
  return transactions
    .filter(t => t.type === 'income' && new Date(t.date) <= endDate)
    .reduce((sum, t) => sum + t.amount, 0);
};

const calculateTotalExpenses = (transactions: Transaction[], currentDate: Date): number => {
  return transactions
    .filter(t => t.type === 'expense' && new Date(t.date) <= currentDate)
    .reduce((sum, t) => sum + t.amount, 0);
};

const calculateRecurringExpenses = (transactions: Transaction[], currentDate: Date, endDate: Date): number => {
  return transactions
    .filter(t => 
      t.type === 'expense' && 
      t.is_recurring && 
      t.next_due_date && 
      new Date(t.next_due_date) <= endDate &&
      new Date(t.next_due_date) > currentDate
    )
    .reduce((sum, t) => sum + t.amount, 0);
};

const calculateDailyBudget = (totalAvailable: number, daysRemaining: number): number => {
  return Math.max(0, totalAvailable / daysRemaining);
};

const calculateRemainingDays = (currentDate: Date, endDate: Date): number => {
  return endDate.getDate() - currentDate.getDate() + 1;
};

export const FinancialPlanningService = {
  calculateAvailableAmount(
    transactions: Transaction[],
    savingsGoalAmount: number = 0
  ): FinancialPlanningStats {
    const now = new Date();
    const dateRanges = calculateDateRanges(now);
    
    const income = calculateTotalIncome(transactions, dateRanges.month.end);
    const expenses = calculateTotalExpenses(transactions, now);
    const recurringExpenses = calculateRecurringExpenses(transactions, now, dateRanges.month.end);

    const totalAvailable = income - expenses - recurringExpenses - savingsGoalAmount;
    const daysRemainingInMonth = calculateRemainingDays(now, dateRanges.month.end);
    const daysRemainingInWeek = 7 - now.getDay();

    const dailyAmount = calculateDailyBudget(totalAvailable, daysRemainingInMonth);
    const weeklyAmount = dailyAmount * daysRemainingInWeek;
    const monthlyAmount = totalAvailable;

    return {
      availableToday: dailyAmount,
      availableThisWeek: weeklyAmount,
      availableThisMonth: monthlyAmount,
      hasRisk: totalAvailable < 0,
      totalIncome: income,
      totalExpenses: expenses,
      recurringExpenses,
      savingsGoalAmount
    };
  }
};

