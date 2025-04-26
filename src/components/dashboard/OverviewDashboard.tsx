import React from 'react';
import { Transaction } from '@/services/transactions';
import { useTranslation } from 'react-i18next';
import { SavingGoal } from '@/services/SavingsService';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import IncomeByTypeChart from '../charts/IncomeByTypeChart';
import DailyBarChart from '../charts/DailyBarChart';
import RevenueVsExpenseChart from '../charts/RevenueVsExpenseChart';
import FinancialGoalsProgress from '../charts/FinancialGoalsProgress';
import DashboardBigNumbers from './DashboardBigNumbers';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import EmptyStateMessage from './EmptyStateMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { transactionCategories } from '@/data/categories';

interface OverviewDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  transactions,
  savingGoals
}) => {
  const {
    t
  } = useTranslation();
  const hasTransactions = transactions.length > 0;
  const hasSavingGoals = savingGoals.length > 0;

  // Calculate total savings from savings goals
  const totalSavings = savingGoals.reduce((total, goal) => total + goal.current_amount, 0);

  // Default chart config with consistent colors as per requirements
  const chartConfig = {
    income: {
      label: t('common.income'),
      theme: {
        light: "#22c55e",
        dark: "#22c55e"
      } // Green for income
    },
    expense: {
      label: t('common.expense'),
      theme: {
        light: "#ef4444",
        dark: "#ef4444"
      } // Red for expenses
    },
    balance: {
      label: t('common.balance'),
      theme: {
        light: "#3b82f6",
        dark: "#3b82f6"
      } // Blue for balance
    },
    savings: {
      label: t('common.savings'),
      theme: {
        light: "#8b5cf6",
        dark: "#8b5cf6"
      } // Purple for savings
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
  return <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Big Numbers */}
      <DashboardBigNumbers transactions={transactions} totalSavings={totalSavings} />

      {/* Financial Alerts accordion removed */}

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expenses by Category (Pie Chart) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{t('dashboard.charts.categoryBreakdown')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasTransactions ? <ExpensesByCategoryChart expenses={transactions} chartConfig={chartConfig} /> : <EmptyStateMessage message={t('dashboard.charts.noData')} />}
          </CardContent>
        </Card>
        
        {/* Income vs Expenses (Line Chart) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{t('dashboard.charts.revenueVsExpense')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasTransactions ? <RevenueVsExpenseChart transactions={transactions} chartConfig={chartConfig} /> : <EmptyStateMessage message={t('dashboard.charts.noData')} />}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Balance (Line Chart) */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{t('dashboard.charts.dailyEvolution')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasTransactions ? <DailyBarChart transactions={transactions} /> : <EmptyStateMessage message={t('dashboard.charts.noData')} />}
          </CardContent>
        </Card>
        
        {/* Financial Goals Progress */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{t('dashboard.charts.financialGoals')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasSavingGoals ? <FinancialGoalsProgress savingGoals={savingGoals} chartConfig={chartConfig} /> : <EmptyStateMessage message={t('dashboard.charts.noGoals')} />}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 - Optional charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income by Type Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{t('dashboard.charts.incomeByType')}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {hasTransactions ? <IncomeByTypeChart incomes={transactions} chartConfig={chartConfig} /> : <EmptyStateMessage message={t('dashboard.charts.noData')} />}
          </CardContent>
        </Card>
      </div>
    </div>;
};

export default OverviewDashboard;
