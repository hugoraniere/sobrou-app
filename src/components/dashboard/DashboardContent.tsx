
import React from 'react';
import AIPromptInput from '../AIPromptInput';
import FilterBar from '../FilterBar';
import DashboardTabs from './DashboardTabs';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';

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
  filteredTransactions,
  savingGoals,
  filters,
  isLoading,
  hasTransactions,
  onTransactionUpdated,
  showOnboarding,
  setShowOnboarding,
  whatsAppConnected,
  onSavingGoalAdded,
  onSavingGoalUpdated
}) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* AI-powered prompt input at the top */}
      <AIPromptInput 
        onTransactionAdded={onTransactionUpdated}
        onSavingAdded={onSavingGoalAdded}
      />
      
      {/* Filter Bar - Only show on transactions tab */}
      <div id="filters-container" className="mt-6">
        <FilterBar 
          filters={filters}
          onFilterChange={() => {}}
          categories={[]}
          onResetFilters={() => {}}
        />
      </div>
      
      <div className="mt-6">
        <DashboardTabs
          transactions={transactions}
          filteredTransactions={filteredTransactions}
          savingGoals={savingGoals}
          filters={filters}
          isLoading={isLoading}
          hasTransactions={hasTransactions}
          onTransactionUpdated={onTransactionUpdated}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
