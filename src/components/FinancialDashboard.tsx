
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Bar,
  Pie,
  Line,
  ResponsiveContainer,
  PieChart,
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell
} from "recharts";

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface FinancialDashboardProps {
  expenses: Expense[];
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ expenses }) => {
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
  
  // Generate chart data
  const expensesByCategory = getExpensesByCategory();
  const expensesOverTime = getExpensesOverTime();
  const monthlyComparison = getMonthlyComparison();
  
  // Get total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Generate unique colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4BC0C0', '#FF6384', '#36A2EB', '#FB6340'];
  
  // Generate insights about spending
  const getInsights = () => {
    if (expenses.length === 0) return [];
    
    const insights = [];
    
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
      {/* Card for total expenses */}
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
      
      {/* Expenses by category (Pie Chart) */}
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
      
      {/* Expenses over time (Line Chart) */}
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
      
      {/* Month-to-month comparison (Bar Chart) */}
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Monthly Comparison</h3>
        {monthlyComparison.length > 0 ? (
          <ChartContainer className="h-[300px]" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyComparison}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload }) => active && payload && payload.length ? (
                    <ChartTooltipContent payload={payload} />
                  ) : null}
                />
                <Legend />
                <Bar dataKey="amount" name="Expenses" fill="#36A2EB" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            No expense data to display
          </div>
        )}
      </div>
    </div>
  );
};
