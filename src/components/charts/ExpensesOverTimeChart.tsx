
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Line,
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Transaction } from '@/services/TransactionService';

interface ExpensesOverTimeChartProps {
  expenses: Transaction[];
  chartConfig: Record<string, any>;
}

const ExpensesOverTimeChart: React.FC<ExpensesOverTimeChartProps> = ({ 
  expenses,
  chartConfig
}) => {
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
  
  const expensesOverTime = getExpensesOverTime();

  return (
    <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
      <h3 className="text-lg font-semibold mb-2">Expenses Over Time</h3>
      {expensesOverTime.length > 0 ? (
        <ChartContainer className="h-[300px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={expensesOverTime}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip
                content={({ active, payload }) => active && payload && payload.length ? (
                  <ChartTooltipContent payload={payload} />
                ) : null}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#0088FE" 
                name="Amount"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
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

export default ExpensesOverTimeChart;
