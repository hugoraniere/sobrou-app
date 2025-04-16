
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardContent from '../components/dashboard/DashboardContent';
import DeveloperControls from '../components/dashboard/DeveloperControls';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';
import { transactionCategories } from '@/data/categories';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  // Extrair os nomes das categorias para os filtros
  const categoryIds = transactionCategories.map(cat => cat.id);
  
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
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
      
      <DashboardLayout
        whatsAppConnected={whatsAppConnected}
        showOnboarding={showOnboarding}
        setShowOnboarding={setShowOnboarding}
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleResetFilters={handleResetFilters}
        categories={categoryIds}
        onTransactionAdded={fetchData}
        onSavingAdded={fetchData}
      >
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
      </DashboardLayout>
      
      <DeveloperControls 
        whatsAppConnected={whatsAppConnected}
        toggleWhatsApp={toggleWhatsApp}
      />
    </>
  );
};

export default Index;
