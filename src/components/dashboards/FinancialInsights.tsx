
import React from 'react';
import { Transaction } from '@/services/TransactionService';

interface FinancialInsightsProps {
  expenses: Transaction[];
}

const FinancialInsights: React.FC<FinancialInsightsProps> = ({ expenses }) => {
  // Get total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Generate insights about spending
  const getInsights = () => {
    if (expenses.length === 0) return [];
    
    const insights = [];
    
    // Helper function to get data for pie chart (expenses by category)
    const getExpensesByCategory = () => {
      const categoryMap = new Map<string, number>();
      
      expenses.forEach(expense => {
        const currentAmount = categoryMap.get(expense.category) || 0;
        categoryMap.set(expense.category, currentAmount + expense.amount);
      });
      
      return Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value
      }));
    };
    
    // Helper function to get data for line chart (expenses over time)
    const getExpensesOverTime = () => {
      const dateMap = new Map<string, number>();
      
      expenses.forEach(expense => {
        const date = expense.date.substring(0, 10); // YYYY-MM-DD
        const currentAmount = dateMap.get(date) || 0;
        dateMap.set(date, currentAmount + expense.amount);
      });
      
      return Array.from(dateMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };
    
    // Helper function to get data for bar chart (month-to-month comparison)
    const getMonthlyComparison = () => {
      const monthMap = new Map<string, number>();
      
      expenses.forEach(expense => {
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
    
    const expensesByCategory = getExpensesByCategory();
    const expensesOverTime = getExpensesOverTime();
    const monthlyComparison = getMonthlyComparison();
    
    // Most expensive category
    if (expensesByCategory.length > 0) {
      const sortedCategories = [...expensesByCategory].sort((a, b) => b.value - a.value);
      const topCategory = sortedCategories[0];
      const percentage = Math.round((topCategory.value / totalExpenses) * 100);
      
      insights.push(`${percentage}% of your spending is on ${topCategory.name}`);
    }
    
    // Month over month trend
    if (monthlyComparison.length >= 2) {
      const lastMonth = monthlyComparison[monthlyComparison.length - 1];
      const previousMonth = monthlyComparison[monthlyComparison.length - 2];
      
      const diff = lastMonth.amount - previousMonth.amount;
      const percentChange = Math.round((diff / previousMonth.amount) * 100);
      
      if (diff > 0) {
        insights.push(`Spending increased by ${percentChange}% compared to last month`);
      } else if (diff < 0) {
        insights.push(`Spending decreased by ${Math.abs(percentChange)}% compared to last month`);
      }
    }
    
    // Average daily expense
    if (expensesOverTime.length > 0) {
      const avgDaily = totalExpenses / expensesOverTime.length;
      insights.push(`Average daily expense is $${avgDaily.toFixed(2)}`);
    }
    
    return insights;
  };
  
  const insights = getInsights();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
      <p className="text-3xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
      
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-500">Insights</h4>
        {insights.length > 0 ? (
          <ul className="space-y-1">
            {insights.map((insight, index) => (
              <li key={index} className="text-sm flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Add more expenses to see insights</p>
        )}
      </div>
    </div>
  );
};

export default FinancialInsights;
