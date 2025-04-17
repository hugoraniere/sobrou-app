
import React from 'react';
import { Transaction } from '../services/TransactionService';
import ExpensesByCategoryChart from './charts/ExpensesByCategoryChart';
import ExpensesOverTimeChart from './charts/ExpensesOverTimeChart';
import MonthlyComparisonChart from './charts/MonthlyComparisonChart';
import FinancialInsights from './dashboards/FinancialInsights';
import { transactionCategories } from '@/data/categories';

interface FinancialDashboardProps {
  expenses: Transaction[];
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ expenses }) => {
  // Create a dynamic chart configuration based on categories from data/categories.ts
  const chartConfig = {};
  
  // Add all transaction categories to the chart config
  transactionCategories.forEach(category => {
    chartConfig[category.id] = {
      label: category.name,
      theme: {
        light: category.color || "#8884D8",
        dark: category.color || "#8884D8"
      }
    };
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      {/* Card for total expenses and insights */}
      <FinancialInsights expenses={expenses} />
      
      {/* Expenses by category (Pie Chart) */}
      <ExpensesByCategoryChart expenses={expenses} chartConfig={chartConfig} />
      
      {/* Expenses over time (Line Chart) */}
      <ExpensesOverTimeChart expenses={expenses} chartConfig={chartConfig} />
      
      {/* Month-to-month comparison (Bar Chart) */}
      <MonthlyComparisonChart expenses={expenses} chartConfig={chartConfig} />
    </div>
  );
};
