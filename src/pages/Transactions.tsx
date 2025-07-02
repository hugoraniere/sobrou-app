
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
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
import TransactionListFilters from '@/components/transactions/molecules/TransactionListFilters';
import ViewModeToggle, { ViewMode } from '@/components/transactions/molecules/ViewModeToggle';

const Transactions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isMobile } = useResponsive();
  const initialFilter = location.state?.initialFilter || {};
  
  // Estados para filtros
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    transactions,
    isLoading,
    hasError,
    errorMessage,
    handleTransactionUpdated,
    retryFetch
  } = useTransactionData();

  // Filtrar transações baseado nos filtros selecionados
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Aplicar filtro de busca se houver termo de pesquisa
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchLower)
      );
    }

    // Aplicar filtro mensal se estiver no modo mensal
    if (viewMode === 'monthly') {
      const [year, month] = currentMonth.split('-').map(Number);
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === year && 
               transactionDate.getMonth() === month - 1;
      });
    }

    return filtered;
  }, [transactions, viewMode, currentMonth, searchTerm]);

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

          {/* Filtros e Toggle de Visão */}
          <div className="mt-4 space-y-3">
            {/* Toggle para alternar entre visão mensal e todas as transações */}
            <div className="flex justify-center">
              <ViewModeToggle 
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            {/* Filtros de busca e navegação mensal */}
            {viewMode === 'monthly' ? (
              <TransactionListFilters
                currentMonth={currentMonth}
                searchTerm={searchTerm}
                onMonthChange={setCurrentMonth}
                onSearchChange={setSearchTerm}
              />
            ) : (
              <Card className={cn("shadow-sm", isMobile ? "p-3" : "p-3")}>
                <div className="flex justify-center">
                  <div className="w-full max-w-[320px]">
                    <input
                      type="text"
                      placeholder="Buscar por descrição, valor ou categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>

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
            ) : filteredTransactions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? 
                    `Nenhuma transação encontrada para "${searchTerm}"` : 
                    'Nenhuma transação encontrada para este período'
                  }
                </p>
              </Card>
            ) : (
              <ModernTransactionList
                transactions={filteredTransactions}
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
