
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEXT } from '@/constants/text';
import DashboardOverview from './tabs/DashboardOverview';
import DashboardTransactions from './tabs/DashboardTransactions';
import DashboardInsights from './tabs/DashboardInsights';
import EmptyDashboard from '../EmptyDashboard';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';

interface DashboardTabsProps {
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
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  transactions,
  filteredTransactions,
  savingGoals,
  filters,
  isLoading,
  hasTransactions,
  onTransactionUpdated,
}) => {
  return (
    <Tabs defaultValue="overview" className="mb-8">
      <TabsList className="w-full max-w-full overflow-x-auto justify-start">
        <TabsTrigger value="overview">{TEXT.dashboard.tabs.overview}</TabsTrigger>
        <TabsTrigger value="transactions">{TEXT.dashboard.tabs.transactions}</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : hasTransactions ? (
          <DashboardOverview transactions={transactions} savingGoals={savingGoals} />
        ) : (
          <EmptyDashboard />
        )}
      </TabsContent>
      
      <TabsContent value="transactions">
        <DashboardTransactions 
          transactions={filteredTransactions}
          filters={filters}
          onTransactionUpdated={onTransactionUpdated}
        />
      </TabsContent>
      
      <TabsContent value="insights">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : hasTransactions ? (
          <DashboardInsights transactions={transactions} />
        ) : (
          <EmptyDashboard />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
