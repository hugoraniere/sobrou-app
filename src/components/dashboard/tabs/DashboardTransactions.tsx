
import React from 'react';
import { Transaction } from '@/services/transactions';
import ModernTransactionList from '@/components/transactions/organisms/ModernTransactionList';
import { LoadingSpinner } from '@/components/ui/spinner';

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
}

const DashboardTransactions: React.FC<DashboardTransactionsProps> = ({
  transactions,
  onTransactionUpdated,
  isLoading = false
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Carregando transações..." />;
  }
  
  return (
    <ModernTransactionList 
      transactions={transactions}
      onTransactionUpdated={onTransactionUpdated}
    />
  );
};

export default DashboardTransactions;
