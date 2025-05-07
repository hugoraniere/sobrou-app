
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction, TransactionService } from '@/services/transactions';
import { toast } from 'sonner';
import AIPromptInput from '@/components/AIPromptInput';
import { useLocation } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import ModernTransactionList from '@/components/transactions/organisms/ModernTransactionList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Transactions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const initialFilter = location.state?.initialFilter || {};
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);

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
    setShowNewTransactionForm(false);
  };

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
          <Button 
            onClick={toggleNewTransactionForm} 
            className="rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova transação
          </Button>
        </div>

        {showNewTransactionForm && (
          <Card className="p-6 mb-6">
            <AIPromptInput 
              onTransactionAdded={handleTransactionUpdated}
              onSavingAdded={handleTransactionUpdated}
            />
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ModernTransactionList
            transactions={transactions}
            onTransactionUpdated={handleTransactionUpdated}
            className="mt-6"
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Transactions;
