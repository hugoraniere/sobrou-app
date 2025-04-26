
import { Transaction } from './types';
import { transactionQueryService } from './transactionQueryService';
import { format, subDays, subMonths } from 'date-fns';

interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expensesByCategory: Record<string, number>;
  incomeBySource: Record<string, number>;
  recentTransactions: Transaction[];
  monthlyComparison: {
    thisMonth: { income: number; expense: number };
    lastMonth: { income: number; expense: number };
  };
}

export const transactionAnalyticsService = {
  async getTransactionSummary(): Promise<TransactionSummary> {
    try {
      // Get transactions for this month and last month
      const today = new Date();
      const startOfThisMonth = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd');
      const startOfLastMonth = format(new Date(today.getFullYear(), today.getMonth() - 1, 1), 'yyyy-MM-dd');
      const endOfLastMonth = format(new Date(today.getFullYear(), today.getMonth(), 0), 'yyyy-MM-dd');
      
      const [thisMonthTransactions, lastMonthTransactions] = await Promise.all([
        transactionQueryService.getTransactionsByDateRange(startOfThisMonth),
        transactionQueryService.getTransactionsByDateRange(startOfLastMonth, endOfLastMonth)
      ]);
      
      // Calculate totals
      const totalIncome = thisMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const totalExpense = thisMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Group by category
      const expensesByCategory = thisMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);
      
      // Group by income source (assuming category represents source for income)
      const incomeBySource = thisMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);
      
      // Get recent transactions
      const recentTransactions = [...thisMonthTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      // Month-to-month comparison
      const lastMonthIncome = lastMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const lastMonthExpense = lastMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        expensesByCategory,
        incomeBySource,
        recentTransactions,
        monthlyComparison: {
          thisMonth: { 
            income: totalIncome, 
            expense: totalExpense 
          },
          lastMonth: { 
            income: lastMonthIncome, 
            expense: lastMonthExpense 
          }
        }
      };
    } catch (error) {
      console.error('Error getting transaction summary:', error);
      throw error;
    }
  }
};
