
import React from 'react';
import { Transaction } from '@/services/transactions';
import ModernTransactionList from '@/components/transactions/organisms/ModernTransactionList';

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
}

const DashboardTransactions: React.FC<DashboardTransactionsProps> = ({
  transactions,
  onTransactionUpdated
}) => {
  return (
    <ModernTransactionList 
      transactions={transactions}
      onTransactionUpdated={onTransactionUpdated}
    />
  );
};

export default DashboardTransactions;
