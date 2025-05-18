
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
import { Plus, AlertCircle, RefreshCcw } from 'lucide-react';
import ImportBankStatementButton from '@/components/transactions/ImportBankStatementButton';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';

const MAX_RETRY_COUNT = 3; // Aumentado o número de tentativas
const RETRY_DELAY = 5000; // Aumentado para 5 segundos
const MAX_LOADING_TIME = 45000; // Aumentado para 45 segundos

const Transactions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const initialFilter = location.state?.initialFilter || {};
  const { isAuthenticated, session } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [retryCount, setRetryCount] = useState(0);
  const [fetchAborted, setFetchAborted] = useState(false);

  const fetchTransactions = useCallback(async (retry = false) => {
    if (!isAuthenticated || !session) {
      console.log('Usuário não autenticado, não é possível buscar transações');
      setIsLoading(false);
      setHasError(true);
      setErrorMessage("Você precisa estar autenticado para ver suas transações.");
      return;
    }

    // Se já temos transações e é um retry, continuar mostrando o que temos
    if (retry && transactions.length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setFetchAborted(false);
    
    try {
      console.log(`Tentativa de buscar transações: ${retry ? 'retry' : 'initial'}`);
      const data = await Promise.race([
        TransactionService.getTransactions(),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            setFetchAborted(true);
            reject(new Error('Tempo limite excedido ao buscar transações'));
          }, MAX_LOADING_TIME);
        })
      ]) as Transaction[];
      
      console.log(`Buscando transações: ${data.length} encontradas`);
      setTransactions(data);
      setIsLoading(false);
      setRetryCount(0); // Resetar contador de tentativas após sucesso
    } catch (error) {
      console.error('Error fetching transactions:', error);
      
      if (fetchAborted) {
        // Se temos transações e o fetch foi abortado, continuar mostrando o que temos
        if (transactions.length > 0) {
          setIsLoading(false);
          toast.error("A busca demorou muito tempo, mas estamos exibindo as transações já carregadas.");
        } else {
          setHasError(true);
          setErrorMessage("Tempo limite excedido ao carregar transações. Por favor, tente novamente.");
          setIsLoading(false);
        }
        return;
      }
      
      // Lógica de retry aprimorada
      if (retryCount < MAX_RETRY_COUNT) {
        console.log(`Tentativa ${retryCount + 1} de ${MAX_RETRY_COUNT}. Tentando novamente em ${RETRY_DELAY}ms`);
        setRetryCount(prevCount => prevCount + 1);
        setTimeout(() => fetchTransactions(true), RETRY_DELAY);
      } else {
        toast.error(t('transactions.fetchError', 'Erro ao carregar transações'));
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido ao buscar transações");
        setIsLoading(false);
      }
    }
  }, [t, isAuthenticated, session, retryCount, transactions]);

  useEffect(() => {
    // Resetar estado e iniciar busca
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    fetchTransactions();
    
    // Adiciona um timeout para garantir que o estado de loading não fica preso
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout reached, forcing reset of loading state');
        setIsLoading(false);
        if (transactions.length === 0) {
          setHasError(true);
          setErrorMessage("Tempo limite excedido ao carregar transações. Algumas funcionalidades podem não estar disponíveis.");
        }
      }
    }, MAX_LOADING_TIME + 2000); // Um pouco mais que o timeout da requisição

    return () => clearTimeout(timeout);
  }, [lastUpdate]);

  const handleTransactionUpdated = useCallback(() => {
    console.log("Atualizando transações...");
    // Forçar uma nova busca completa das transações
    setLastUpdate(Date.now());
  }, []);

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
              onTransactionAdded={handleTransactionUpdated} // Atualizar após adicionar
              onSavingAdded={handleTransactionUpdated} // Atualizar após adicionar saving
              className="bg-white"
            />
          </Card>
        )}

        {isLoading ? (
          <LoadingSpinner 
            message="Carregando transações..." 
            timeout={15000} // Aumento do tempo de loading
          />
        ) : hasError ? (
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Erro ao carregar transações</h3>
            <p className="text-gray-600 mb-4">
              {errorMessage || "Não foi possível carregar suas transações. Verifique sua conexão e tente novamente."}
            </p>
            <Button onClick={() => {
              setRetryCount(0);
              fetchTransactions();
            }} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </Card>
        ) : transactions.length === 0 ? (
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold mb-2">Nenhuma transação encontrada</h3>
            <p className="text-gray-500 mb-4">
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
            className="mt-6 space-y-4"
            key={`transactions-list-${lastUpdate}`}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Transactions;
