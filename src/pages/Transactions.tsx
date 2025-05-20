
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import ModernTransactionList from '@/components/transactions/organisms/ModernTransactionList';
import { Card } from '@/components/ui/card';
import { useTransactionData } from '@/hooks/useTransactionData';
import { TransactionsLoadingState } from '@/components/transactions/states/TransactionsLoadingState';
import { TransactionsErrorState } from '@/components/transactions/states/TransactionsErrorState';
import { TransactionsEmptyState } from '@/components/transactions/states/TransactionsEmptyState';
import AIPromptInput from '@/components/AIPromptInput';

const Transactions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const initialFilter = location.state?.initialFilter || {};
  
  const {
    transactions,
    isLoading,
    hasError,
    errorMessage,
    handleTransactionUpdated,
    retryFetch
  } = useTransactionData();

  return (
    <TooltipProvider>
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {t('transactions.title', 'Transações')}
            </h1>
          </div>
        </div>

        {/* AIPromptInput sempre visível */}
        <Card className="p-6 mb-6">
          <AIPromptInput 
            onTransactionAdded={handleTransactionUpdated}
            onSavingAdded={handleTransactionUpdated}
            className="bg-white"
          />
        </Card>

        {isLoading ? (
          <TransactionsLoadingState timeout={15000} />
        ) : hasError ? (
          <TransactionsErrorState 
            errorMessage={errorMessage} 
            onRetry={retryFetch} 
          />
        ) : transactions.length === 0 ? (
          <TransactionsEmptyState onAddTransaction={() => {}} />
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
