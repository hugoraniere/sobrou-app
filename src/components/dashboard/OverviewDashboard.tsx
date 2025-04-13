
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

  // Default chart config with consistent colors
  const chartConfig = {
    income: {
      label: t('common.income'),
      theme: { light: "#0088FE", dark: "#0088FE" }
    },
    expense: {
      label: t('common.expense'),
      theme: { light: "#FF8042", dark: "#FF8042" }
    },
    savings: {
      label: t('common.savings'),
      theme: { light: "#00C49F", dark: "#00C49F" }
    },
    food: {
      label: "Alimentação",
      theme: { light: "#FF8042", dark: "#FF8042" }
    },
    housing: {
      label: "Moradia",
      theme: { light: "#0088FE", dark: "#0088FE" }
    },
    transportation: {
      label: "Transporte",
      theme: { light: "#00C49F", dark: "#00C49F" }
    },
    entertainment: {
      label: "Lazer",
      theme: { light: "#FFBB28", dark: "#FFBB28" }
    }
  };

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
    <div className="space-y-6">
      {/* Big Numbers */}
      <DashboardBigNumbers 
        transactions={transactions} 
        totalSavings={totalSavings} 
      />

      {/* Financial Alerts as Accordion */}
      <Accordion type="single" collapsible className="bg-white p-4 rounded-lg shadow">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.categoryBreakdown')}</h3>
            {hasTransactions ? (
              <ExpensesByCategoryChart expenses={transactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={t('dashboard.charts.noData')} />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.incomeByType')}</h3>
            {hasTransactions ? (
              <IncomeByTypeChart incomes={transactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={t('dashboard.charts.noData')} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.dailyEvolution')}</h3>
            {hasTransactions ? (
              <DailyBarChart transactions={transactions} />
            ) : (
              <EmptyStateMessage message={t('dashboard.charts.noData')} />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.balanceByAccount')}</h3>
            {hasTransactions ? (
              <BalanceByAccountChart transactions={transactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={t('dashboard.charts.noData')} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.revenueVsExpense')}</h3>
            {hasTransactions ? (
              <RevenueVsExpenseChart transactions={transactions} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={t('dashboard.charts.noData')} />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('dashboard.charts.financialGoals')}</h3>
            {hasSavingGoals ? (
              <FinancialGoalsProgress savingGoals={savingGoals} chartConfig={chartConfig} />
            ) : (
              <EmptyStateMessage message={t('dashboard.charts.noGoals')} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;
