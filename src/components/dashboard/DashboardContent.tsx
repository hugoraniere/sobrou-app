
import React from 'react';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';
import DashboardOverview from './tabs/DashboardOverview';
import DashboardInsights from './tabs/DashboardInsights';

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
      <DashboardOverview 
        transactions={transactions} 
        savingGoals={savingGoals} 
      />
    </div>
  );
};

export default DashboardContent;
