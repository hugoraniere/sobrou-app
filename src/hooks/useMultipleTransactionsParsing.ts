import { useState } from 'react';
import { parseExpenseService } from '@/services/transactions/parseExpenseService';
import { ParsedExpense } from '@/services/transactions/types';

// Normalizador determinístico para garantir classificação correta
const EXPENSE_TRIGGERS = [
  'gastei', 'gasto', 'paguei', 'pago', 'comprei', 'compro',
  'saiu', 'sai', 'debito', 'débito', 'perdi', 'perco',
  'gastando', 'pagando', 'comprando', 'perdendo',
  'foi gasto', 'foi pago', 'foi comprado',
  'vou gastar', 'vou pagar', 'vou comprar',
  'conta de', 'fatura', 'boleto', 'parcela', 'prestação',
  'multa', 'taxa', 'juros', 'despesa', 'custo'
];

const INCOME_TRIGGERS = [
  'recebi', 'recebo', 'ganhei', 'ganho', 'entrou',
  'entrada', 'crédito', 'deposito', 'depósito',
  'recebendo', 'ganhando', 'foi recebido', 'foi depositado',
  'vou receber', 'vou ganhar', 'caiu na conta',
  'salário', 'salario', 'pagamento', 'freelancer', 'freela',
  'bônus', 'bonus', 'comissão', 'comissao', 'prêmio', 'premio',
  'restituição', 'restituicao', 'cashback', 'dividendos',
  'aluguel recebido', 'venda', 'faturei', 'lucro', 'rendimento'
];

function normalizeTransactionType(originalText: string, aiType?: string): 'expense' | 'income' {
  const lowerText = originalText.toLowerCase();
  
  // Verificar triggers de despesa primeiro (mais específicos)
  const hasExpenseTrigger = EXPENSE_TRIGGERS.some(trigger => 
    lowerText.includes(trigger)
  );
  
  if (hasExpenseTrigger) {
    return 'expense';
  }
  
  // Verificar triggers de receita
  const hasIncomeTrigger = INCOME_TRIGGERS.some(trigger => 
    lowerText.includes(trigger)
  );
  
  if (hasIncomeTrigger) {
    return 'income';
  }
  
  // Se não houver triggers claros, usar resultado da IA ou padrão
  if (aiType === 'income' || aiType === 'receita') {
    return 'income';
  }
  
  // Padrão: despesa (mais comum)
  return 'expense';
}

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
      console.log("🔄 Processing transcription:", transcriptionText);
      const result = await parseExpenseService.parseExpenseText(transcriptionText);
      console.log("📋 Raw result from parseExpenseService:", result);
      
      // Normalize to array and add IDs
      const transactionsArray = Array.isArray(result) ? result : [result];
      console.log("📊 Transactions array:", transactionsArray);
      
      const transactionsWithIds = transactionsArray.map((transaction, index) => ({
        ...transaction,
        date: selectedDate || transaction.date, // Use selected date if provided
        type: normalizeTransactionType(transcriptionText, transaction.type), // Normalizar tipo
        id: `temp-${Date.now()}-${index}`
      }));
      
      console.log("✅ Final processed transactions with IDs:", transactionsWithIds);
      console.log("📈 Number of transactions to set:", transactionsWithIds.length);
      
      setTransactions(transactionsWithIds);
      
      // Log the state update
      console.log("🔄 State updated - hasTransactions will be:", transactionsWithIds.length > 0);
      
    } catch (error) {
      console.error('❌ Error processing transcription:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar transcrição');
    } finally {
      setIsProcessing(false);
      console.log("🏁 Processing finished");
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
    console.log("💾 Confirmando transações:", transactions.length);
    const transactionsToSave = transactions.map(({ id, ...transaction }) => transaction);
    onTransactionsConfirm(transactionsToSave);
    // Não fazer reset aqui - será feito após o salvamento bem-sucedido
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