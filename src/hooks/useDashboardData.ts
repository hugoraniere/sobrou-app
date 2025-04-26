
import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionService } from '@/services/transactions';
import { SavingGoal, SavingsService } from '@/services/SavingsService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardData = () => {
  // State for transactions and saving goals
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsAppConnected, setWhatsAppConnected] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { user } = useAuth();
  
  // For demo purposes, toggle states
  const toggleWhatsApp = () => setWhatsAppConnected(!whatsAppConnected);
  
  // Fetch transactions and saving goals
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando busca de dados...');
      
      // Verificar autenticação antes de prosseguir
      if (!user) {
        console.warn('Usuário não autenticado. Não é possível buscar dados.');
        setIsLoading(false);
        return;
      }
      
      // Verificar WhatsApp conectado pelo user.user_metadata
      if (user.user_metadata?.whatsapp_number) {
        setWhatsAppConnected(true);
      }
      
      const fetchTransactionsPromise = TransactionService.getTransactions()
        .catch(err => {
          console.error('Erro ao buscar transações:', err);
          toast.error('Erro ao carregar transações');
          return [] as Transaction[];
        });
      
      const fetchSavingsPromise = SavingsService.getSavingGoals()
        .catch(err => {
          console.error('Erro ao buscar metas de economia:', err);
          toast.error('Erro ao carregar metas de economia');
          return [] as SavingGoal[];
        });
      
      const [fetchedTransactions, fetchedSavingGoals] = await Promise.all([
        fetchTransactionsPromise,
        fetchSavingsPromise
      ]);
      
      console.log('Dados recebidos:', { 
        transações: fetchedTransactions.length, 
        metas: fetchedSavingGoals.length 
      });
      
      setTransactions(fetchedTransactions);
      setSavingGoals(fetchedSavingGoals);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Efeito que verifica se o usuário viu o onboarding
  useEffect(() => {
    // Verificar se o usuário já viu o onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding === 'true') {
      setShowOnboarding(false);
    }
  }, []);
  
  return {
    transactions,
    savingGoals,
    isLoading,
    whatsAppConnected,
    showOnboarding,
    setShowOnboarding,
    fetchData,
    toggleWhatsApp,
    hasTransactions: transactions.length > 0
  };
};
