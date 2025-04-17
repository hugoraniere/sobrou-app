
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction } from '@/services/TransactionService';
import { SavingGoal } from '@/services/SavingsService';
import DashboardBigNumbers from './DashboardBigNumbers';
import DashboardCharts from './DashboardCharts';
import DashboardInsights from './DashboardInsights';

interface HomeDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ 
  transactions,
  savingGoals
}) => {
  const { t } = useTranslation();

  // Calculate total savings
  const calculateTotalSavings = () => {
    return savingGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
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

  // Sample recommendations
  const sampleRecommendations = [
    {
      id: '1',
      title: t('dashboard.recommendations.savingsGoal'),
      description: t('dashboard.recommendations.savingsGoalDescription'),
      type: 'goal' as const,
      progress: 40
    },
    {
      id: '2',
      title: t('dashboard.recommendations.monthlySavings'),
      description: t('dashboard.recommendations.monthlySavingsDescription'),
      type: 'saving' as const
    },
    {
      id: '3',
      title: t('dashboard.recommendations.tip'),
      description: t('dashboard.recommendations.tipDescription'),
      type: 'tip' as const
    },
    {
      id: '4',
      title: t('dashboard.recommendations.investment'),
      description: t('dashboard.recommendations.investmentDescription'),
      type: 'tip' as const
    }
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Big Numbers Section */}
      <DashboardBigNumbers 
        transactions={transactions}
        totalSavings={calculateTotalSavings()}
      />

      {/* Charts Section */}
      <DashboardCharts transactions={transactions} />

      {/* Alerts and Recommendations Section */}
      <DashboardInsights 
        alerts={sampleAlerts}
        recommendations={sampleRecommendations}
      />
    </div>
  );
};

export default HomeDashboard;
