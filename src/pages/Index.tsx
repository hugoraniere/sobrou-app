
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardContent from '../components/dashboard/DashboardContent';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTranslation } from 'react-i18next';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Upload, FileText } from 'lucide-react';
import AddTransactionTabbedDialog from '@/components/transactions/AddTransactionTabbedDialog';
import ImportBankStatementButton from '@/components/transactions/import/ImportBankStatementButton';
import { useNavigate } from 'react-router-dom';

// Onboarding Components
import { WelcomeModal } from '../components/onboarding/WelcomeModal';
import { GetStartedStepper } from '../components/onboarding/GetStartedStepper';
import { TourBanner } from '../components/tour/TourBanner';

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  
  const {
    transactions,
    savingGoals,
    isLoading: dataLoading,
    fetchData,
    hasTransactions,
    whatsAppConnected,
    showOnboarding,
    setShowOnboarding
  } = useDashboardData();
  
  const { filters, filteredTransactions } = useFilteredTransactions(transactions);
  
  const handleTransactionAdded = () => {
    fetchData();
  };

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
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center gap-2"
            data-tour-id="dashboard.header.add-transaction-btn"
          >
            <Plus className="h-4 w-4" />
            {t('transactions.add', 'Adicionar Transação')}
          </Button>
          
          <Button
            onClick={() => navigate('/reports/mei-closing')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Relatório MEI
          </Button>
          
          <ImportBankStatementButton 
            onTransactionsAdded={handleTransactionAdded}
            redirectToTransactions={true}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Upload className="h-4 w-4" />
          </ImportBankStatementButton>
        </div>
      </ResponsivePageHeader>

      <TourBanner />
      {/* GetStartedStepper disabled - using Product Tour only */}
      {/* <GetStartedStepper /> */}

      <DashboardContent
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        savingGoals={savingGoals}
        filters={filters}
        isLoading={isLoading}
        hasTransactions={hasTransactions}
        onTransactionUpdated={handleTransactionAdded}
        whatsAppConnected={whatsAppConnected}
        showOnboarding={showOnboarding}
        setShowOnboarding={setShowOnboarding}
        onSavingGoalAdded={fetchData}
        onSavingGoalUpdated={fetchData}
      />

      <AddTransactionTabbedDialog
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        onTransactionAdded={handleTransactionAdded}
      />

      {/* WelcomeModal disabled - using Product Tour welcome modal only */}
      {/* <WelcomeModal /> */}
    </ResponsivePageContainer>
  );
};

export default Index;
