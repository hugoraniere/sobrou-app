
import React from 'react';
import { Transaction } from '@/services/transactions';
import { calculateInsightMetrics, getCategoryExpenses, getMonthlyComparison } from '@/utils/insightUtils';
import FinancialMetricsCard from '../insights/FinancialMetricsCard';
import InsightList from '../insights/InsightList';
import { Card, CardContent } from '@/components/ui/card';

interface FinancialInsightsProps {
  transactions: Transaction[];
}

const FinancialInsights: React.FC<FinancialInsightsProps> = ({ transactions }) => {
  // Calculate metrics using utility functions
  const { totalExpenses, totalIncome, balance } = calculateInsightMetrics(transactions);
  
  // Generate insights about spending
  const getInsights = () => {
    if (transactions.length === 0) return [];
    
    const insights = [];
    const expensesByCategory = getCategoryExpenses(transactions);
    const monthlyComparison = getMonthlyComparison(transactions);
    
    // Most expensive category
    if (expensesByCategory.length > 0) {
      const sortedCategories = [...expensesByCategory].sort((a, b) => b.value - a.value);
      const topCategory = sortedCategories[0];
      const percentage = Math.round((topCategory.value / totalExpenses) * 100);
      
      insights.push(`${percentage}% dos seus gastos são em ${topCategory.name}`);
    }
    
    // Month over month trend
    if (monthlyComparison.length >= 2) {
      const lastMonth = monthlyComparison[monthlyComparison.length - 1];
      const previousMonth = monthlyComparison[monthlyComparison.length - 2];
      
      const diff = lastMonth.amount - previousMonth.amount;
      const percentChange = Math.round((diff / previousMonth.amount) * 100);
      
      if (diff > 0) {
        insights.push(`Gastos aumentaram em ${percentChange}% comparado ao mês anterior`);
      } else if (diff < 0) {
        insights.push(`Gastos diminuíram em ${Math.abs(percentChange)}% comparado ao mês anterior`);
      }
    }
    
    // Average daily expense
    if (transactions.length > 0) {
      const avgDaily = totalExpenses / transactions.length;
      insights.push(`Despesa média diária é R$ ${avgDaily.toFixed(2)}`);
    }
    
    return insights;
  };
  
  const insights = getInsights();

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="p-4">
          <FinancialMetricsCard
            totalExpenses={totalExpenses}
            totalIncome={totalIncome}
            balance={balance}
          />
        </CardContent>
      </Card>
      <Card className="bg-white">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">Insights</h3>
          <InsightList insights={insights} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialInsights;
