
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardContent from '../components/dashboard/DashboardContent';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTranslation } from 'react-i18next';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

const Index = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const {
    transactions,
    savingGoals,
    isLoading: dataLoading,
    whatsAppConnected,
    showOnboarding,
    setShowOnboarding,
    fetchData,
    hasTransactions
  } = useDashboardData();
  
  const {
    filters,
    filteredTransactions
  } = useFilteredTransactions(transactions);
  
  // Aguardar a autenticação ser completada antes de buscar dados
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('Usuário autenticado, buscando dados do dashboard...');
      fetchData().catch(error => {
        console.error('Erro ao buscar dados no useEffect do Index:', error);
      });
    }
  }, [isAuthenticated, authLoading, fetchData]);
  
  const isLoading = authLoading || dataLoading;
  
  return (
    <ResponsivePageContainer>
      <ResponsivePageHeader 
        title={t('dashboard.title')}
        description={t('dashboard.subtitle')}
      />
      
      <div className="space-y-6">
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
    </ResponsivePageContainer>
  );
};

export default Index;
