
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction } from '@/services/TransactionService';
import { SavingGoal } from '@/services/SavingsService';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import IncomeByTypeChart from '../charts/IncomeByTypeChart';
import DailyBarChart from '../charts/DailyBarChart';
import BalanceByAccountChart from '../charts/BalanceByAccountChart';
import RevenueVsExpenseChart from '../charts/RevenueVsExpenseChart';
import FinancialGoalsProgress from '../charts/FinancialGoalsProgress';
import FinancialAlerts from './FinancialAlerts';
import DashboardBigNumbers from './DashboardBigNumbers';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmptyStateMessage from './EmptyStateMessage';
import { Card, CardContent } from '@/components/ui/card';

interface OverviewDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ 
  transactions,
  savingGoals
}) => {
  const { t } = useTranslation();
  const hasTransactions = transactions.length > 0;
  const hasSavingGoals = savingGoals.length > 0;

  // Calculate total savings from savings goals
  const totalSavings = savingGoals.reduce((total, goal) => total + goal.current_amount, 0);

  // Default chart config with consistent colors as per requirements
  const chartConfig = {
    income: {
      label: t('common.income'),
      theme: { light: "#22c55e", dark: "#22c55e" } // Green for income
    },
    expense: {
      label: t('common.expense'),
      theme: { light: "#ef4444", dark: "#ef4444" } // Red for expenses
    },
    balance: {
      label: t('common.balance'),
      theme: { light: "#3b82f6", dark: "#3b82f6" } // Blue for balance
    },
    savings: {
      label: t('common.savings'),
      theme: { light: "#8b5cf6", dark: "#8b5cf6" } // Purple for savings
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
          theme: { light: categoryInfo.color, dark: categoryInfo.color }
        };
      }
    }
  });

  // Sample alerts (in real app, these would be calculated based on actual financial data)
  const sampleAlerts = [
    {
      id: '1',
      title: t('dashboard.alerts.budget'),
      description: t('dashboard.alerts.budgetDescription'),
      type: 'warning' as const
    },
    {
      id: '2',
      title: t('dashboard.alerts.fixedExpenses'),
      description: t('dashboard.alerts.fixedExpensesDescription'),
      type: 'info' as const
    },
    {
      id: '3',
      title: t('dashboard.alerts.balance'),
      description: t('dashboard.alerts.balanceDescription'),
      type: 'success' as const
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden px-4 md:px-0">
      {/* Big Numbers */}
      <DashboardBigNumbers 
        transactions={transactions} 
        totalSavings={totalSavings} 
      />

      {/* Financial Alerts as Accordion */}
      <Accordion type="single" collapsible className="bg-white p-4 rounded-lg border border-gray-100">
        <AccordionItem value="alerts" className="border-b-0">
          <AccordionTrigger className="py-2">
            <h3 className="text-lg font-semibold">{t('dashboard.alerts.title')}</h3>
          </AccordionTrigger>
          <AccordionContent>
            <FinancialAlerts alerts={sampleAlerts} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expenses by Category (Pie Chart) */}
        <div className="w-full">
          <ExpensesByCategoryChart expenses={transactions} chartConfig={chartConfig} />
        </div>
        
        {/* Income vs Expenses (Line Chart) */}
        <div className="w-full">
          <RevenueVsExpenseChart transactions={transactions} chartConfig={chartConfig} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Balance (Line Chart) */}
        <div className="w-full">
          <DailyBarChart transactions={transactions} />
        </div>
        
        {/* Financial Goals Progress */}
        <div className="w-full">
          <FinancialGoalsProgress savingGoals={savingGoals} chartConfig={chartConfig} />
        </div>
      </div>

      {/* Row 3 - Optional charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income by Type Chart */}
        <Card className="border border-gray-100 shadow-none min-h-[300px] w-full max-w-full overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.incomeByType')}</h3>
            {hasTransactions ? (
              <div className="h-[250px] w-full flex justify-center items-center">
                <IncomeByTypeChart incomes={transactions} chartConfig={chartConfig} />
              </div>
            ) : (
              <EmptyStateMessage message={t('dashboard.charts.noData')} />
            )}
          </CardContent>
        </Card>
        
        {/* Balance by Account Chart */}
        <Card className="border border-gray-100 shadow-none min-h-[300px] w-full max-w-full overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.balanceByAccount')}</h3>
            {hasTransactions ? (
              <div className="h-[250px] w-full flex justify-center items-center">
                <BalanceByAccountChart transactions={transactions} chartConfig={chartConfig} />
              </div>
            ) : (
              <EmptyStateMessage message={t('dashboard.charts.noData')} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Import the categories here to prevent circular dependencies
import { transactionCategories } from '@/data/categories';

export default OverviewDashboard;
