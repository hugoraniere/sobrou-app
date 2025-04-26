
import { transactionQueryService } from './transactionQueryService';

export const transactionAnalyticsService = {
  async getTransactionSummary(startDate: string, endDate: string) {
    const transactions = await transactionQueryService.getTransactionsByDateRange(startDate, endDate);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netBalance = totalIncome - totalExpenses;
    
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
      
    return {
      totalIncome,
      totalExpenses,
      netBalance,
      expensesByCategory
    };
  }
};

