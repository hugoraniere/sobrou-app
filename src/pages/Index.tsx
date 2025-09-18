
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingProvider } from '../contexts/OnboardingContext';
import DashboardContent from '../components/dashboard/DashboardContent';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTranslation } from 'react-i18next';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddTransactionDialog from '@/components/transactions/AddTransactionDialog';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import { OnboardingDialog } from '@/components/onboarding/OnboardingDialog';
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist';
import { ProductTour } from '@/components/onboarding/ProductTour';
import { HelpWidget } from '@/components/onboarding/HelpWidget';
import { OnboardingBanner } from '@/components/onboarding/OnboardingBanner';
import { UpcomingPayables } from '@/components/dashboard/UpcomingPayables';

const Index = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  
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
    <OnboardingProvider>
      <ResponsivePageContainer>
        <ResponsivePageHeader 
          title={t('dashboard.title')}
          description={t('dashboard.subtitle')}
        >
          <Button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center gap-2"
            data-tour="add-transaction"
          >
            <Plus className="h-4 w-4" />
            {t('transactions.add', 'Adicionar Transação')}
          </Button>
        </ResponsivePageHeader>
        
        <div className="space-y-6">
          <OnboardingBanner />
          <UpcomingPayables />
          
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

        <AddTransactionDialog
          open={showAddTransaction}
          onOpenChange={setShowAddTransaction}
          onTransactionAdded={() => {
            fetchData();
            setShowAddTransaction(false);
          }}
        />

        <WelcomeModal />
        <OnboardingDialog />
        <OnboardingChecklist />
        <ProductTour />
        <HelpWidget />
      </ResponsivePageContainer>
    </OnboardingProvider>
  );
};

export default Index;
