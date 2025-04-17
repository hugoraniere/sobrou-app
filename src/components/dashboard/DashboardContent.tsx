
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SavingGoals from '../SavingGoals';
import EmptyDashboard from '../EmptyDashboard';
import { Transaction } from '@/services/TransactionService';
import { SavingGoal } from '@/services/SavingsService';
import TransactionsTable from '../TransactionsTable';
import OnboardingPanel from '../OnboardingPanel';
import OverviewDashboard from './OverviewDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import FinancialInsights from './FinancialInsights';

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Show/hide filters based on active tab
  useEffect(() => {
    const filtersContainer = document.getElementById('filters-container');
    if (filtersContainer) {
      filtersContainer.style.display = activeTab === 'transactions' ? 'block' : 'none';
    }
  }, [activeTab]);
  
  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 md:px-6">
      <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-full overflow-x-auto">
          <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('dashboard.tabs.transactions')}</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        {/* Overview Dashboard Tab */}
        <TabsContent value="overview">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : hasTransactions ? (
            <OverviewDashboard 
              transactions={transactions}
              savingGoals={savingGoals}
            />
          ) : (
            <EmptyDashboard />
          )}
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <TransactionsTable 
            transactions={filteredTransactions}
            filters={{
              category: filters.category,
              type: filters.type,
              dateRange: filters.dateRange,
              minAmount: filters.minAmount,
              maxAmount: filters.maxAmount
            }}
            onTransactionUpdated={onTransactionUpdated}
          />
        </TabsContent>
        
        {/* Insights Tab (replacing Analytics) */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : hasTransactions ? (
                <FinancialInsights transactions={transactions} />
              ) : (
                <EmptyDashboard />
              )}
            </div>
            
            <div>
              <Card>
                <CardContent className="pt-6">
                  <SavingGoals 
                    savingGoals={savingGoals}
                    onGoalAdded={onSavingGoalAdded}
                    onGoalUpdated={onSavingGoalUpdated}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Onboarding Panel */}
      {showOnboarding && activeTab === "overview" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 relative mb-8">
          <button 
            onClick={() => setShowOnboarding(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
          <OnboardingPanel whatsAppConnected={whatsAppConnected} />
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
