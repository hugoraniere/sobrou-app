
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
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OverviewDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  transactions,
  savingGoals
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
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

  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Card de Visão Geral com Big Numbers - ocupa toda a largura */}
      <DashboardOverviewCard transactions={transactions} totalSavings={totalSavings} />

      {/* Grid responsivo para duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transações Recentes */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">Últimas transações</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAllTransactions}
            >
              Ver todas
            </Button>
          </CardHeader>
          <CardContent className="h-[300px] overflow-y-auto">
            {hasTransactions ? (
              <RecentTransactions transactions={filteredTransactions} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>

        {/* Gastos por Categoria */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Gastos por categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasTransactions ? (
              <ExpensesByCategoryChart expenses={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>

        {/* Receitas vs Despesas */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Receita vs Despesa</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasTransactions ? (
              <RevenueVsExpenseChart transactions={filteredTransactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>
          
        {/* Movimentações Diárias */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.dailyEvolution}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasTransactions ? (
              <DailyBarChart transactions={filteredTransactions} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
            )}
          </CardContent>
        </Card>

        {/* Metas Financeiras */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.financialGoals}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasSavingGoals ? (
              <FinancialGoalsProgress savingGoals={savingGoals} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={TEXT.dashboard.charts.noGoals} />
            )}
          </CardContent>
        </Card>
        
        {/* Fontes de Receita */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{TEXT.dashboard.charts.incomeByType}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
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
