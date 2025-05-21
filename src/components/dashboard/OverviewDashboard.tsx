
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import IncomeByTypeChart from '../charts/IncomeByTypeChart';
import DailyBarChart from '../charts/DailyBarChart';
import RevenueVsExpenseChart from '../charts/RevenueVsExpenseChart';
import FinancialGoalsProgress from '../charts/FinancialGoalsProgress';
import DashboardOverviewCard from './DashboardOverviewCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { transactionCategories } from '@/data/categories';
import { TEXT } from '@/constants/text';
import EmptyStateMessage from './EmptyStateMessage';
import RecentTransactions from './RecentTransactions';
import { CATEGORY_COLORS } from '@/constants/categoryColors';
import { useIsMobile } from '@/hooks/use-mobile';

interface OverviewDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  transactions,
  savingGoals
}) => {
  const isMobile = useIsMobile();
  
  // Inicializa filteredTransactions com todas as transações
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  
  // Atualiza quando transactions mudar
  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);
  
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

  // Add category colors from our new color tokens
  transactions.forEach(transaction => {
    const categoryId = transaction.category;
    if (!chartConfig[categoryId]) {
      // Use our new color tokens
      const categoryColor = CATEGORY_COLORS[categoryId as keyof typeof CATEGORY_COLORS] || "#CFCFCF";
      chartConfig[categoryId] = {
        label: transactionCategories.find(cat => cat.id === categoryId)?.name || categoryId,
        theme: {
          light: categoryColor,
          dark: categoryColor
        }
      };
    }
  });

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden px-4 md:px-0">
      {/* Card de Visão Geral com Big Numbers */}
      <DashboardOverviewCard transactions={transactions} totalSavings={totalSavings} />

      {/* Grid de cards responsivo - Ajuste para mobile e largura mínima */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="w-full min-w-[280px]">
          <CardHeader>
            <CardTitle className="text-xl">Transações recentes</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'h-[420px]' : 'h-[320px]'} overflow-auto`}>
            {hasTransactions ? (
              <RecentTransactions transactions={filteredTransactions} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
        
        {/* Expenses by Category (Pie Chart) */}
        <Card className="w-full min-w-[280px]">
          <CardHeader>
            <CardTitle className="text-xl">Gastos por categoria</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'h-[420px]' : 'h-[320px]'} overflow-auto`}>
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
        {/* Income vs Expenses (Bar Chart) */}
        <Card className="w-full min-w-[280px]">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.revenueVsExpense}</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'h-[420px]' : 'h-[320px]'} overflow-auto`}>
            {hasTransactions ? (
              <RevenueVsExpenseChart transactions={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
        
        {/* Daily Balance (Line Chart) */}
        <Card className="w-full min-w-[280px]">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.dailyEvolution}</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'h-[420px]' : 'h-[320px]'} overflow-auto`}>
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
        <Card className="w-full min-w-[280px]">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.financialGoals}</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'h-[420px]' : 'h-[320px]'} overflow-auto`}>
            {hasSavingGoals ? (
              <FinancialGoalsProgress savingGoals={savingGoals} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noGoals} />
            )}
          </CardContent>
        </Card>
        
        {/* Income by Type Chart */}
        <Card className="w-full min-w-[280px]">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.incomeByType}</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'h-[420px]' : 'h-[320px]'} overflow-auto`}>
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
