
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Wallet, Receipt, TrendingUp, Clock, Database, 
  AlertCircle, Target, Gift
} from 'lucide-react';
import BigNumberCard from './BigNumberCard';
import FinancialAlerts from './FinancialAlerts';
import GoalsRecommendations from './GoalsRecommendations';
import DailyBarChart from '../charts/DailyBarChart';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import MonthlyComparisonChart from '../charts/MonthlyComparisonChart';
import { Transaction } from '@/services/TransactionService';
import { SavingGoal } from '@/services/SavingsService';

interface HomeDashboardProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ 
  transactions,
  savingGoals
}) => {
  const { t } = useTranslation();

  // Calculate available balance (income - expenses)
  const calculateBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return income - expenses;
  };

  // Calculate total expenses for current month
  const calculateMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
          date.getMonth() === currentMonth && 
          date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Calculate total income for current month
  const calculateMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
          date.getMonth() === currentMonth && 
          date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Calculate pending balance (future scheduled transactions)
  const calculatePendingBalance = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        date.setHours(0, 0, 0, 0);
        return date > today;
      })
      .reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);
  };

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
    <div className="space-y-6">
      {/* Big Numbers Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <BigNumberCard
          title={t('dashboard.bigNumbers.availableBalance')}
          value={calculateBalance()}
          icon={Wallet}
          color="#22c55e"
          tooltip={t('dashboard.bigNumbers.availableBalanceTooltip')}
          subtitle={t('dashboard.bigNumbers.today')}
        />
        <BigNumberCard
          title={t('dashboard.bigNumbers.monthlyExpenses')}
          value={calculateMonthlyExpenses()}
          icon={Receipt}
          color="#ef4444"
          tooltip={t('dashboard.bigNumbers.monthlyExpensesTooltip')}
          subtitle={t('dashboard.bigNumbers.thisMonth')}
        />
        <BigNumberCard
          title={t('dashboard.bigNumbers.monthlyIncome')}
          value={calculateMonthlyIncome()}
          icon={TrendingUp}
          color="#0ea5e9"
          tooltip={t('dashboard.bigNumbers.monthlyIncomeTooltip')}
          subtitle={t('dashboard.bigNumbers.thisMonth')}
        />
        <BigNumberCard
          title={t('dashboard.bigNumbers.pendingBalance')}
          value={calculatePendingBalance()}
          icon={Clock}
          color="#f97316"
          tooltip={t('dashboard.bigNumbers.pendingBalanceTooltip')}
          subtitle={t('dashboard.bigNumbers.upcoming')}
        />
        <BigNumberCard
          title={t('dashboard.bigNumbers.totalSavings')}
          value={calculateTotalSavings()}
          icon={Database}
          color="#1a1f2c"
          tooltip={t('dashboard.bigNumbers.totalSavingsTooltip')}
          subtitle={t('dashboard.bigNumbers.accumulated')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.dailyEvolution')}</h3>
          <DailyBarChart transactions={transactions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.categoryBreakdown')}</h3>
          <ExpensesByCategoryChart expenses={transactions} chartConfig={{}} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.balanceEvolution')}</h3>
        <MonthlyComparisonChart expenses={transactions} chartConfig={{}} />
      </div>

      {/* Alerts and Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialAlerts alerts={sampleAlerts} />
        <GoalsRecommendations recommendations={sampleRecommendations} />
      </div>
    </div>
  );
};

export default HomeDashboard;
