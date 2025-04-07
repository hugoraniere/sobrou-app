
import { useState, useEffect } from 'react';
import { Transaction, TransactionService } from '@/services/TransactionService';
import { SavingGoal, SavingsService } from '@/services/SavingsService';

export const useDashboardData = () => {
  // State for transactions and saving goals
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsAppConnected, setWhatsAppConnected] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // For demo purposes, toggle states
  const toggleWhatsApp = () => setWhatsAppConnected(!whatsAppConnected);
  
  // Fetch transactions and saving goals
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedTransactions, fetchedSavingGoals] = await Promise.all([
        TransactionService.getTransactions(),
        SavingsService.getSavingGoals()
      ]);
      
      setTransactions(fetchedTransactions);
      setSavingGoals(fetchedSavingGoals);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
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
