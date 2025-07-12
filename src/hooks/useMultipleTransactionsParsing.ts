import { useState } from 'react';
import { parseExpenseService } from '@/services/transactions/parseExpenseService';
import { ParsedExpense } from '@/services/transactions/types';

interface TransactionWithId extends ParsedExpense {
  id: string;
}

interface UseMultipleTransactionsParsingProps {
  onTransactionsConfirm: (transactions: ParsedExpense[]) => void;
}

export const useMultipleTransactionsParsing = ({ onTransactionsConfirm }: UseMultipleTransactionsParsingProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<TransactionWithId[]>([]);
  const [error, setError] = useState<string | null>(null);

  const processTranscription = async (transcriptionText: string, selectedDate?: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log("Processing transcription:", transcriptionText);
      const result = await parseExpenseService.parseExpenseText(transcriptionText);
      
      // Normalize to array and add IDs
      const transactionsArray = Array.isArray(result) ? result : [result];
      const transactionsWithIds = transactionsArray.map((transaction, index) => ({
        ...transaction,
        date: selectedDate || transaction.date, // Use selected date if provided
        id: `temp-${Date.now()}-${index}`
      }));
      
      console.log("Processed transactions:", transactionsWithIds);
      setTransactions(transactionsWithIds);
    } catch (error) {
      console.error('Error processing transcription:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar transcrição');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateTransaction = (id: string, updatedData: Partial<ParsedExpense>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...transaction, ...updatedData }
          : transaction
      )
    );
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const confirmAllTransactions = () => {
    const transactionsToSave = transactions.map(({ id, ...transaction }) => transaction);
    onTransactionsConfirm(transactionsToSave);
    reset();
  };

  const addNewTransaction = (newTransaction: Partial<ParsedExpense>) => {
    const transactionWithId: TransactionWithId = {
      id: `temp-${Date.now()}`,
      description: newTransaction.description || '',
      amount: newTransaction.amount || 0,
      category: newTransaction.category || 'compras',
      type: newTransaction.type || 'expense',
      date: newTransaction.date || new Date().toISOString().split('T')[0],
      isSaving: newTransaction.isSaving || false,
      savingGoal: newTransaction.savingGoal
    };
    
    setTransactions(prev => [...prev, transactionWithId]);
  };

  const reset = () => {
    setTransactions([]);
    setError(null);
    setIsProcessing(false);
  };

  return {
    isProcessing,
    transactions,
    error,
    processTranscription,
    updateTransaction,
    removeTransaction,
    confirmAllTransactions,
    addNewTransaction,
    reset,
    hasTransactions: transactions.length > 0
  };
};