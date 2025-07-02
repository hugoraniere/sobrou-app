
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
import ImportBankStatementButton from '@/components/transactions/import/ImportBankStatementButton';

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
      <div className={cn(
        "w-full overflow-hidden",
        isMobile ? "px-4" : "container mx-auto max-w-screen-xl"
      )}>
        <div>
          {/* Header */}
          <div className="mt-6 mb-6">
            <div className={cn(
              "flex items-start gap-4",
              isMobile ? "flex-col" : "justify-between"
            )}>
              <div className="flex-1">
                <h1 className={cn(
                  "font-bold text-gray-900",
                  isMobile ? "text-2xl" : "text-3xl"
                )}>
                  {t('transactions.title', 'Transações')}
                </h1>
                {!isMobile && (
                  <p className="text-gray-600 text-sm mt-1">
                    Visualize e gerencie todas as suas transações financeiras
                  </p>
                )}
              </div>
              <div className={cn(isMobile && "w-full flex justify-end")}>
                <ImportBankStatementButton onTransactionsAdded={handleTransactionUpdated} />
              </div>
            </div>
          </div>

          {/* AIPromptInput sempre visível */}
          <Card className={cn(
            "shadow-sm mt-4",
            isMobile ? "p-4" : "p-6"
          )}>
            <AIPromptInput 
              onTransactionAdded={handleTransactionUpdated}
              onSavingAdded={handleTransactionUpdated}
              className="bg-white"
            />
          </Card>

          {/* Content */}
          <div className="mt-4">
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
                showCardPadding={false}
              />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Transactions;
