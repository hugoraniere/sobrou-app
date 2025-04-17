
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardContent from '../components/dashboard/DashboardContent';
import DeveloperControls from '../components/dashboard/DeveloperControls';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';
import { transactionCategories } from '@/data/categories';
import { useTranslation } from 'react-i18next';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIPromptInput from '../components/AIPromptInput';
import FilterBar from '../components/FilterBar';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  
  const {
    transactions,
    savingGoals,
    isLoading,
    whatsAppConnected,
    showOnboarding,
    setShowOnboarding,
    fetchData,
    toggleWhatsApp,
    hasTransactions
  } = useDashboardData();
  
  const {
    filters,
    handleFilterChange,
    handleResetFilters,
    filteredTransactions
  } = useFilteredTransactions(transactions);
  
  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Extract category IDs for filters
  const categoryIds = transactionCategories.map(cat => cat.id);
  
  return (
    <>
      {/* Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsAddTransactionOpen(true)}
          className="rounded-full h-14 w-14 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg"
          aria-label={t('transactions.addNew', 'Nova transação')}
        >
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        setIsOpen={setIsAddTransactionOpen}
        onTransactionAdded={fetchData}
      />
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        
        {/* AI-powered prompt input at the top */}
        <AIPromptInput 
          onTransactionAdded={fetchData}
          onSavingAdded={fetchData}
        />
        
        {/* Filter Bar - Only show on transactions tab */}
        <div id="filters-container">
          <FilterBar 
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categoryIds}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        <DashboardContent
          transactions={transactions}
          filteredTransactions={filteredTransactions}
          savingGoals={savingGoals}
          filters={filters}
          isLoading={isLoading}
          hasTransactions={hasTransactions}
          onTransactionUpdated={fetchData}
          showOnboarding={showOnboarding}
          setShowOnboarding={setShowOnboarding}
          whatsAppConnected={whatsAppConnected}
          onSavingGoalAdded={fetchData}
          onSavingGoalUpdated={fetchData}
        />
      </div>
      
      <DeveloperControls 
        whatsAppConnected={whatsAppConnected}
        toggleWhatsApp={toggleWhatsApp}
      />
    </>
  );
};

export default Index;
