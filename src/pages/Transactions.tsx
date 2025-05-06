
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction, TransactionService } from '@/services/transactions';
import TransactionsTable from '@/components/TransactionsTable';
import { toast } from 'sonner';
import AIPromptInput from '@/components/AIPromptInput';

const Transactions = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    dateRange: '',
    minAmount: '',
    maxAmount: '',
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await TransactionService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(t('transactions.fetchError', 'Erro ao carregar transações'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransactionUpdated = () => {
    fetchTransactions();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('transactions.title', 'Transações')}</h1>
        <p className="text-gray-600 mt-2">
          {t('transactions.subtitle', 'Visualize e gerencie todas as suas transações financeiras')}
        </p>
      </div>

      <AIPromptInput 
        onTransactionAdded={handleTransactionUpdated}
        onSavingAdded={handleTransactionUpdated}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <TransactionsTable 
          transactions={transactions} 
          filters={filters}
          onTransactionUpdated={handleTransactionUpdated}
        />
      )}
    </div>
  );
};

export default Transactions;
