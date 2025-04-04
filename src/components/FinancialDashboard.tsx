
import React from 'react';
import { Transaction } from '../services/TransactionService';
import ExpensesByCategoryChart from './charts/ExpensesByCategoryChart';
import ExpensesOverTimeChart from './charts/ExpensesOverTimeChart';
import MonthlyComparisonChart from './charts/MonthlyComparisonChart';
import FinancialInsights from './dashboards/FinancialInsights';

interface FinancialDashboardProps {
  expenses: Transaction[];
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ expenses }) => {
  // Chart configuration
  const chartConfig = {
    food: {
      label: "Food",
      theme: {
        light: "#FFBB28",
        dark: "#FFBB28"
      }
    },
    housing: {
      label: "Housing",
      theme: {
        light: "#0088FE",
        dark: "#0088FE"
      }
    },
    transportation: {
      label: "Transportation",
      theme: {
        light: "#00C49F",
        dark: "#00C49F"
      }
    },
    entertainment: {
      label: "Entertainment",
      theme: {
        light: "#FF8042",
        dark: "#FF8042"
      }
    },
    other: {
      label: "Other",
      theme: {
        light: "#A259FF",
        dark: "#A259FF"
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
