
import { Transaction } from '@/services/transactions';

export const calculateInsightMetrics = (transactions: Transaction[]) => {
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  return { totalExpenses, totalIncome, balance };
};

export const getCategoryExpenses = (transactions: Transaction[]) => {
  const categoryMap = new Map<string, number>();
  
  transactions.forEach(expense => {
    const currentAmount = categoryMap.get(expense.category) || 0;
    categoryMap.set(expense.category, currentAmount + expense.amount);
  });
  
  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value
  }));
};

export const getMonthlyComparison = (transactions: Transaction[]) => {
  const monthMap = new Map<string, number>();
  
  transactions.forEach(expense => {
    const date = new Date(expense.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    const currentAmount = monthMap.get(monthYear) || 0;
    monthMap.set(monthYear, currentAmount + expense.amount);
  });
  
  return Array.from(monthMap.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
      
      if (yearA !== yearB) return Number(yearA) - Number(yearB);
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(monthA) - months.indexOf(monthB);
    });
};
