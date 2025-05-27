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
import ResponsiveContainer from '@/components/layout/ResponsiveContainer';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const Transactions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isMobile } = useResponsive();
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
      <ResponsiveContainer>
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-2">
            <h1 className={cn(
              "font-bold text-gray-900",
              isMobile ? "text-2xl" : "text-3xl"
            )}>
              {t('transactions.title', 'Transações')}
            </h1>
            {!isMobile && (
              <p className="text-gray-600 text-sm">
                Visualize e gerencie todas as suas transações financeiras
              </p>
            )}
          </div>

          {/* AIPromptInput sempre visível */}
          <Card className={cn(
            "shadow-sm",
            isMobile ? "p-4" : "p-6"
          )}>
            <AIPromptInput 
              onTransactionAdded={handleTransactionUpdated}
              onSavingAdded={handleTransactionUpdated}
              className="bg-white"
            />
          </Card>

          {/* Content */}
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
              className="space-y-3 md:space-y-4"
            />
          )}
        </div>
      </ResponsiveContainer>
    </TooltipProvider>
  );
};

export default Transactions;
