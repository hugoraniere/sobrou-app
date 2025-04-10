
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialDashboard } from '../FinancialDashboard';
import SavingGoals from '../SavingGoals';
import EmptyDashboard from '../EmptyDashboard';
import { Transaction } from '@/services/TransactionService';
import { SavingGoal } from '@/services/SavingsService';
import TransactionsTable from '../TransactionsTable';
import OnboardingPanel from '../OnboardingPanel';
import HomeDashboard from './HomeDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState("home");
  
  // Show/hide filters based on active tab
  useEffect(() => {
    const filtersContainer = document.getElementById('filters-container');
    if (filtersContainer) {
      filtersContainer.style.display = activeTab === 'transactions' ? 'block' : 'none';
    }
  }, [activeTab]);
  
  return (
    <>
      <Tabs defaultValue="home" className="mb-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="home">{t('dashboard.tabs.home')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('dashboard.tabs.transactions')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('dashboard.tabs.analytics')}</TabsTrigger>
        </TabsList>
        
        {/* Home Dashboard Tab */}
        <TabsContent value="home">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : hasTransactions ? (
            <HomeDashboard 
              transactions={transactions}
              savingGoals={savingGoals}
            />
          ) : (
            <EmptyDashboard />
          )}
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <div className="mb-8">
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
          </div>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : hasTransactions ? (
                <FinancialDashboard expenses={filteredTransactions} />
              ) : (
                <EmptyDashboard />
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <SavingGoals 
                  savingGoals={savingGoals}
                  onGoalAdded={onSavingGoalAdded}
                  onGoalUpdated={onSavingGoalUpdated}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Onboarding Panel */}
      {showOnboarding && activeTab === "home" && (
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
    </>
  );
};

export default DashboardContent;
