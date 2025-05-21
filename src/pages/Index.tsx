
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardContent from '../components/dashboard/DashboardContent';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  
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
    <div className="container mx-auto max-w-screen-xl space-y-6 w-full overflow-hidden">
      <div className="mt-6 mb-6 px-4 md:px-0">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Acompanhe suas finanças e analise seus hábitos de gastos</p>
      </div>
      
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
