
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import IncomeByTypeChart from '../charts/IncomeByTypeChart';
import DailyBarChart from '../charts/DailyBarChart';
import RevenueVsExpenseChart from '../charts/RevenueVsExpenseChart';
import FinancialGoalsProgress from '../charts/FinancialGoalsProgress';
import DashboardBigNumbers from './DashboardBigNumbers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { transactionCategories } from '@/data/categories';
import { TEXT } from '@/constants/text';
import EmptyStateMessage from './EmptyStateMessage';
import RecentTransactions from './RecentTransactions';
import PeriodFilterButton from '../transactions/molecules/PeriodFilterButton';

interface OverviewDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  transactions,
  savingGoals
}) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [periodLabel, setPeriodLabel] = useState<string>("Mês atual");
  
  // Inicializa com o primeiro dia do mês atual até hoje
  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    filterTransactionsByPeriod(startOfMonth, today);
  }, [transactions]);
  
  const filterTransactionsByPeriod = (startDate: Date, endDate: Date) => {
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    setFilteredTransactions(filtered);
    
    // Atualiza o rótulo do período
    const today = new Date();
    if (
      startDate.getDate() === 1 && 
      startDate.getMonth() === today.getMonth() && 
      startDate.getFullYear() === today.getFullYear() &&
      endDate.getTime() === today.setHours(23, 59, 59, 999)
    ) {
      setPeriodLabel("Mês atual");
    } else if (
      startDate.getTime() === new Date().setHours(0, 0, 0, 0) &&
      endDate.getTime() === today.setHours(23, 59, 59, 999)
    ) {
      setPeriodLabel("Hoje");
    } else {
      setPeriodLabel(`${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}`);
    }
  };
  
  const hasTransactions = filteredTransactions.length > 0;
  const hasSavingGoals = savingGoals.length > 0;

  // Calculate total savings from savings goals
  const totalSavings = savingGoals.reduce((total, goal) => total + goal.current_amount, 0);

  // Default chart config with consistent colors
  const chartConfig = {
    income: {
      label: TEXT.common.income,
      theme: {
        light: "#22c55e",
        dark: "#22c55e"
      }
    },
    expense: {
      label: TEXT.common.expense,
      theme: {
        light: "#ef4444",
        dark: "#ef4444"
      }
    },
    balance: {
      label: TEXT.common.balance,
      theme: {
        light: "#3b82f6",
        dark: "#3b82f6"
      }
    },
    savings: {
      label: TEXT.common.savings,
      theme: {
        light: "#8b5cf6",
        dark: "#8b5cf6"
      }
    }
  };

  // Add category colors
  transactions.forEach(transaction => {
    const categoryId = transaction.category;
    if (!chartConfig[categoryId]) {
      const categoryInfo = transactionCategories.find(cat => cat.id === categoryId);
      if (categoryInfo) {
        chartConfig[categoryId] = {
          label: categoryInfo.name,
          theme: {
            light: categoryInfo.color,
            dark: categoryInfo.color
          }
        };
      }
    }
  });

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Filtro de período */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dados para: {periodLabel}</h2>
        <PeriodFilterButton onApplyFilter={filterTransactionsByPeriod} />
      </div>
      
      {/* Big Numbers */}
      <DashboardBigNumbers transactions={filteredTransactions} totalSavings={totalSavings} />

      {/* Row 1 - Recent Transactions & Expenses by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <RecentTransactions transactions={filteredTransactions} />
        
        {/* Expenses by Category (Pie Chart) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.categoryBreakdown}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasTransactions ? (
              <ExpensesByCategoryChart expenses={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income vs Expenses (Line Chart) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.revenueVsExpense}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasTransactions ? (
              <RevenueVsExpenseChart transactions={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
        
        {/* Daily Balance (Line Chart) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.dailyEvolution}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasTransactions ? (
              <DailyBarChart transactions={filteredTransactions} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Goals Progress */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.financialGoals}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasSavingGoals ? (
              <FinancialGoalsProgress savingGoals={savingGoals} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noGoals} />
            )}
          </CardContent>
        </Card>
        
        {/* Income by Type Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.incomeByType}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasTransactions ? (
              <IncomeByTypeChart incomes={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;
