
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Pie,
  ResponsiveContainer,
  PieChart,
  Cell
} from "recharts";
import { Transaction } from '@/services/TransactionService';

interface ExpensesByCategoryChartProps {
  expenses: Transaction[];
  chartConfig: Record<string, any>;
}

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ 
  expenses,
  chartConfig 
}) => {
  // Generate unique colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4BC0C0', '#FF6384', '#36A2EB', '#FB6340'];
  
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
  
  const expensesByCategory = getExpensesByCategory();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Expenses by Category</h3>
      {expensesByCategory.length > 0 ? (
        <ChartContainer className="h-[300px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => active && payload && payload.length ? (
                  <ChartTooltipContent payload={payload} />
                ) : null}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No expense data to display
        </div>
      )}
    </div>
  );
};

export default ExpensesByCategoryChart;
