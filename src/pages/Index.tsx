
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardContent from '../components/dashboard/DashboardContent';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';
import { transactionCategories } from '@/data/categories';
import { useTranslation } from 'react-i18next';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIPromptInput from '../components/AIPromptInput';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
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
  
  // Set language to Portuguese
  useEffect(() => {
    i18n.changeLanguage('pt-BR');
  }, [i18n]);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
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
      
      <div className="space-y-6 w-full max-w-full overflow-hidden">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        
        {/* AI-powered prompt input at the top */}
        <AIPromptInput 
          onTransactionAdded={fetchData}
          onSavingAdded={fetchData}
        />
        
        <DashboardContent
          transactions={transactions}
          filteredTransactions={filteredTransactions}
          savingGoals={savingGoals}
          filters={filters}
          isLoading={isLoading}
          hasTransactions={hasTransactions}
          onTransactionUpdated={fetchData}
          showOnboarding={false} // Always hide onboarding panel
          setShowOnboarding={setShowOnboarding}
          whatsAppConnected={whatsAppConnected}
          onSavingGoalAdded={fetchData}
          onSavingGoalUpdated={fetchData}
        />
      </div>
    </>
  );
};

export default Index;
