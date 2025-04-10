
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

interface OverviewDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ 
  transactions,
  savingGoals
}) => {
  const { t } = useTranslation();

  // Default chart config
  const chartConfig = {
    income: {
      label: t('common.income'),
      theme: { light: "#0ea5e9", dark: "#0ea5e9" }
    },
    expense: {
      label: t('common.expense'),
      theme: { light: "#ef4444", dark: "#ef4444" }
    },
    savings: {
      label: t('common.savings'),
      theme: { light: "#22c55e", dark: "#22c55e" }
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
      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.categoryBreakdown')}</h3>
          <ExpensesByCategoryChart expenses={transactions} chartConfig={chartConfig} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.incomeByType')}</h3>
          <IncomeByTypeChart incomes={transactions} chartConfig={chartConfig} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.dailyEvolution')}</h3>
          <DailyBarChart transactions={transactions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.balanceByAccount')}</h3>
          <BalanceByAccountChart transactions={transactions} chartConfig={chartConfig} />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.revenueVsExpense')}</h3>
          <RevenueVsExpenseChart transactions={transactions} chartConfig={chartConfig} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.financialGoals')}</h3>
          <FinancialGoalsProgress savingGoals={savingGoals} chartConfig={chartConfig} />
        </div>
      </div>

      {/* Row 4 - Full width */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">{t('dashboard.alerts.title')}</h3>
        <FinancialAlerts alerts={sampleAlerts} />
      </div>
    </div>
  );
};

export default OverviewDashboard;
