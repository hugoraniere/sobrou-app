
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
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import ImportBankStatementButton from '@/components/transactions/import/ImportBankStatementButton';
import ViewModeToggle, { ViewMode } from '@/components/transactions/molecules/ViewModeToggle';
import MonthNavigator from '@/components/transactions/molecules/MonthNavigator';
import SearchBar from '@/components/transactions/molecules/SearchBar';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

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
      <ResponsivePageContainer>
        <ResponsivePageHeader 
          title={t('transactions.title')}
          description={t('transactions.subtitle')}
        >
          <ImportBankStatementButton onTransactionsAdded={handleTransactionUpdated} />
        </ResponsivePageHeader>
        
        <div className="space-y-6">
          {/* AIPromptInput */}
          <Card className="p-4 sm:p-6">
            <AIPromptInput 
              onTransactionAdded={handleTransactionUpdated}
              onSavingAdded={handleTransactionUpdated}
              className="bg-white"
            />
          </Card>

          {/* Filtros */}
          <Card className="p-3">
            <div className={cn(
              "flex gap-4 items-center",
              isMobile ? "flex-col space-y-3" : "justify-between"
            )}>
              <div className={cn(isMobile ? "w-full flex justify-center" : "")}>
                <ViewModeToggle 
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
              
              <div className={cn(
                "flex gap-3 items-center",
                isMobile ? "w-full flex-col space-y-3" : ""
              )}>
                {viewMode === 'monthly' && (
                  <div className="flex items-center">
                    <MonthNavigator 
                      currentMonth={currentMonth} 
                      onMonthChange={setCurrentMonth}
                    />
                  </div>
                )}
                
                <div className={cn(isMobile ? "w-full" : "")}>
                  <SearchBar 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={isMobile ? "Buscar..." : "Buscar por descrição, valor ou categoria..."}
                    className={cn(isMobile ? "w-full max-w-none" : "max-w-[320px]")}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Lista de Transações */}
          <div>
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
      </ResponsivePageContainer>
    </TooltipProvider>
  );
};

export default Transactions;
