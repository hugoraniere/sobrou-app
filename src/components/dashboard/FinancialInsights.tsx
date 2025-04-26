
import React from 'react';
import { Transaction } from '@/services/transactions';
import { calculateInsightMetrics, getCategoryExpenses, getMonthlyComparison } from '@/utils/insightUtils';
import FinancialMetricsCard from '../insights/FinancialMetricsCard';
import InsightList from '../insights/InsightList';

interface FinancialInsightsProps {
  expenses: Transaction[];
}

const FinancialInsights: React.FC<FinancialInsightsProps> = ({ expenses }) => {
  // Calculate metrics using utility functions
  const { totalExpenses, totalIncome, balance } = calculateInsightMetrics(expenses);
  
  // Generate insights about spending
  const getInsights = () => {
    if (expenses.length === 0) return [];
    
    const insights = [];
    const expensesByCategory = getCategoryExpenses(expenses);
    const monthlyComparison = getMonthlyComparison(expenses);
    
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
    if (expenses.length > 0) {
      const avgDaily = totalExpenses / expenses.length;
      insights.push(`Average daily expense is $${avgDaily.toFixed(2)}`);
    }
    
    return insights;
  };
  
  const insights = getInsights();

  return (
    <div className="space-y-6">
      <FinancialMetricsCard
        totalExpenses={totalExpenses}
        totalIncome={totalIncome}
        balance={balance}
      />
      <InsightList insights={insights} />
    </div>
  );
};

export default FinancialInsights;
