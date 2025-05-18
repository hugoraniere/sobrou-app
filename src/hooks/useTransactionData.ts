
import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionService } from '@/services/transactions';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const MAX_RETRY_COUNT = 3;
const RETRY_DELAY = 3000; // Reduzido para 3 segundos
const MAX_LOADING_TIME = 20000; // Reduzido para 20 segundos

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
      console.log(`Buscando transações: ${retry ? 'retry' : 'initial'}`);
      
      // Criar um timeout controlável
      const timeoutId = setTimeout(() => {
        console.log('Tempo limite excedido, abortando busca');
        setFetchAborted(true);
        
        // Se temos dados, continuar mostrando
        if (transactions.length > 0) {
          setIsLoading(false);
          // Mostrar um toast sutil em vez de um erro completo
          toast.info("Algumas transações podem estar desatualizadas");
        }
      }, MAX_LOADING_TIME);
      
      // Buscar dados
      const data = await TransactionService.getTransactions();
      
      // Limpar timeout se a busca completou com sucesso
      clearTimeout(timeoutId);
      
      if (fetchAborted) return; // Se já foi abortado, não continuar
      
      console.log(`Transações carregadas: ${data.length}`);
      
      setTransactions(data);
      setIsLoading(false);
      setRetryCount(0); // Resetar contador de tentativas após sucesso
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      
      if (fetchAborted) {
        // Se temos transações e o fetch foi abortado, continuar mostrando o que temos
        if (transactions.length > 0) {
          setIsLoading(false);
          // Sem toast aqui, já foi mostrado pelo timeout
        } else {
          setHasError(true);
          setErrorMessage("A busca demorou muito tempo. Por favor, tente novamente.");
          setIsLoading(false);
        }
        return;
      }
      
      // Lógica de retry aprimorada
      if (retryCount < MAX_RETRY_COUNT) {
        console.log(`Tentativa ${retryCount + 1} de ${MAX_RETRY_COUNT}. Nova tentativa em ${RETRY_DELAY}ms`);
        setRetryCount(prevCount => prevCount + 1);
        setTimeout(() => fetchTransactions(true), RETRY_DELAY);
      } else {
        if (transactions.length > 0) {
          // Se temos dados anteriores, mostrar eles com um aviso
          toast.warning("Usando dados anteriores. Algumas transações podem estar desatualizadas.");
          setIsLoading(false);
        } else {
          toast.error("Não foi possível carregar suas transações");
          setHasError(true);
          setErrorMessage(error instanceof Error ? error.message : "Erro ao buscar transações");
          setIsLoading(false);
        }
      }
    }
  }, [isAuthenticated, session, retryCount, transactions, fetchAborted]);

  useEffect(() => {
    // Resetar estado e iniciar busca
    setHasError(false);
    setRetryCount(0);
    fetchTransactions();
    
    // Não precisamos de um timeout adicional aqui, pois já temos timeout
    // no próprio fetchTransactions
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
      setLastUpdate(Date.now());
    }
  };
};
