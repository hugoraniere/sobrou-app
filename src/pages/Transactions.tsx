
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction, TransactionService } from '@/services/transactions';
import { toast } from 'sonner';
import AIPromptInput from '@/components/AIPromptInput';
import { useLocation } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import ModernTransactionList from '@/components/transactions/organisms/ModernTransactionList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, AlertCircle } from 'lucide-react';
import ImportBankStatementButton from '@/components/transactions/ImportBankStatementButton';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';

const Transactions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const initialFilter = location.state?.initialFilter || {};
  const { isAuthenticated, session } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated || !session) {
      console.log('Usuário não autenticado, não é possível buscar transações');
      setIsLoading(false);
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    
    try {
      const data = await TransactionService.getTransactions();
      console.log(`Buscando transações: ${data.length} encontradas`);
      setTransactions(data);
      setIsLoading(false); // Garantir que o loading é desativado após sucesso
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(t('transactions.fetchError', 'Erro ao carregar transações'));
      setHasError(true);
      setIsLoading(false); // Garantir que o loading é desativado após erro
    }
  }, [t, isAuthenticated, session]);

  useEffect(() => {
    fetchTransactions();
    
    // Adiciona um timeout para garantir que o estado de loading não fica preso
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout reached, forcing reset of loading state');
        setIsLoading(false);
      }
    }, 15000); // 15 segundos de timeout

    return () => clearTimeout(timeout);
  }, [fetchTransactions, lastUpdate]);

  const handleTransactionUpdated = useCallback(() => {
    console.log("Atualizando transações...");
    setLastUpdate(Date.now()); // Força uma nova busca das transações
    setShowNewTransactionForm(false);
  }, []);

  const toggleNewTransactionForm = () => {
    setShowNewTransactionForm(!showNewTransactionForm);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('transactions.title', 'Transações')}</h1>
            <p className="text-gray-600">
              {t('transactions.subtitle', 'Visualize e gerencie todas as suas transações financeiras')}
            </p>
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
          <LoadingSpinner message="Carregando transações..." />
        ) : hasError ? (
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Erro ao carregar transações</h3>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar suas transações. Verifique sua conexão e tente novamente.
            </p>
            <Button onClick={fetchTransactions}>Tentar novamente</Button>
          </Card>
        ) : transactions.length === 0 ? (
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold mb-2">Nenhuma transação encontrada</h3>
            <p className="text-gray-600 mb-4">
              Você ainda não possui transações registradas. Adicione sua primeira transação agora!
            </p>
            {!showNewTransactionForm && (
              <Button onClick={toggleNewTransactionForm}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar transação
              </Button>
            )}
          </Card>
        ) : (
          <ModernTransactionList
            transactions={transactions}
            onTransactionUpdated={handleTransactionUpdated}
            className="mt-6"
            key={`transactions-list-${lastUpdate}`} // Forçar rerender quando as transações são atualizadas
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Transactions;
