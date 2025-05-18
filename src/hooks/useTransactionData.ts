
import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionService } from '@/services/transactions';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const MAX_RETRY_COUNT = 3;
const RETRY_DELAY = 5000;
const MAX_LOADING_TIME = 45000;

export const useTransactionData = () => {
  const { isAuthenticated, session } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
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
      
      // Log das datas para depuração
      if (data.length > 0) {
        console.log('Exemplo de datas de transações:');
        data.slice(0, 5).forEach(t => {
          console.log(`ID: ${t.id}, Data: ${t.date}, Tipo: ${typeof t.date}`);
        });
      }
      
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
        toast.error("Erro ao carregar transações");
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido ao buscar transações");
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, session, retryCount, transactions]);

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

  return {
    transactions,
    isLoading,
    hasError,
    errorMessage,
    handleTransactionUpdated,
    retryFetch: () => {
      setRetryCount(0);
      fetchTransactions();
    }
  };
};
