
import React from 'react';
import { Transaction } from '@/services/transactions';
import ModernTransactionList from '@/components/transactions/organisms/ModernTransactionList';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardTransactionsProps {
  transactions: Transaction[];
  filters: {
    category: string;
    type: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
  };
  onTransactionUpdated: () => void;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

const DashboardTransactions: React.FC<DashboardTransactionsProps> = ({
  transactions,
  onTransactionUpdated,
  isLoading = false,
  hasError = false,
  onRetry
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Carregando transações..." timeout={5000} />;
  }
  
  if (hasError) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Erro ao carregar transações</h3>
        <p className="text-gray-600 mb-4">
          Não foi possível carregar suas transações. Verifique sua conexão e tente novamente.
        </p>
        {onRetry && (
          <Button onClick={onRetry}>Tentar novamente</Button>
        )}
      </Card>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold mb-2">Nenhuma transação encontrada</h3>
        <p className="text-gray-600 mb-4">
          Não há transações para exibir.
        </p>
      </Card>
    );
  }
  
  return (
    <ModernTransactionList 
      transactions={transactions}
      onTransactionUpdated={onTransactionUpdated}
    />
  );
};

export default DashboardTransactions;
