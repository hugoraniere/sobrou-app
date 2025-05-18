
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import ModernTransactionList from '@/components/transactions/organisms/ModernTransactionList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AIPromptInput from '@/components/AIPromptInput';
import ImportBankStatementButton from '@/components/transactions/ImportBankStatementButton';
import { useTransactionData } from '@/hooks/useTransactionData';
import { TransactionsLoadingState } from '@/components/transactions/states/TransactionsLoadingState';
import { TransactionsErrorState } from '@/components/transactions/states/TransactionsErrorState';
import { TransactionsEmptyState } from '@/components/transactions/states/TransactionsEmptyState';

const Transactions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const initialFilter = location.state?.initialFilter || {};
  
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  
  const {
    transactions,
    isLoading,
    hasError,
    errorMessage,
    handleTransactionUpdated,
    retryFetch
  } = useTransactionData();

  const toggleNewTransactionForm = () => {
    setShowNewTransactionForm(!showNewTransactionForm);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {t('transactions.title', 'Transações')}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <ImportBankStatementButton onTransactionsAdded={handleTransactionUpdated} />
            <Button 
              onClick={toggleNewTransactionForm} 
              className="rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova transação
            </Button>
          </div>
        </div>

        {showNewTransactionForm && (
          <Card className="p-6 mb-6">
            <AIPromptInput 
              onTransactionAdded={handleTransactionUpdated}
              onSavingAdded={handleTransactionUpdated}
              className="bg-white"
            />
          </Card>
        )}

        {isLoading ? (
          <TransactionsLoadingState timeout={15000} />
        ) : hasError ? (
          <TransactionsErrorState 
            errorMessage={errorMessage} 
            onRetry={retryFetch} 
          />
        ) : transactions.length === 0 ? (
          <TransactionsEmptyState onAddTransaction={toggleNewTransactionForm} />
        ) : (
          <ModernTransactionList
            transactions={transactions}
            onTransactionUpdated={handleTransactionUpdated}
            className="mt-6 space-y-4"
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Transactions;
