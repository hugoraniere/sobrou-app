
import React from 'react';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';
import DashboardOverview from './tabs/DashboardOverview';
import DashboardInsights from './tabs/DashboardInsights';
import { Grid } from 'lucide-react';

interface DashboardContentProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  savingGoals: SavingGoal[];
  filters: {
    category: string;
    type: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
  };
  isLoading: boolean;
  hasTransactions: boolean;
  onTransactionUpdated: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  whatsAppConnected: boolean;
  onSavingGoalAdded: () => void;
  onSavingGoalUpdated: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  transactions,
  savingGoals,
  isLoading,
  hasTransactions,
  onTransactionUpdated,
}) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Visão Geral */}
      <div>
        <DashboardOverview 
          transactions={transactions} 
          savingGoals={savingGoals} 
        />
      </div>
      
      {/* Insights */}
      <div className="bg-white rounded-lg border p-6 mt-6 mx-4 md:mx-6">
        <h2 className="text-2xl font-semibold mb-6">Insights</h2>
        <DashboardInsights transactions={transactions} />
      </div>
    </div>
  );
};

export default DashboardContent;

// Removidos os componentes não utilizados
// import RecentTransactions from './RecentTransactions';
// import DashboardCharts from './DashboardCharts';
// import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
