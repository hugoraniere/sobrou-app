import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardContent from '../components/dashboard/DashboardContent';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTranslation } from 'react-i18next';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog';
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
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    i18n.changeLanguage('pt-BR');
  }, [i18n]);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Visão geral</h1>
        <p className="text-gray-600">{t('dashboard.subtitle')}</p>
      </div>
      
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
        showOnboarding={false}
        setShowOnboarding={setShowOnboarding}
        whatsAppConnected={whatsAppConnected}
        onSavingGoalAdded={fetchData}
        onSavingGoalUpdated={fetchData}
      />
    </div>
  );
};

export default Index;
