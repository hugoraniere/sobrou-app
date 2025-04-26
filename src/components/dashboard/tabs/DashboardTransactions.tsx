
import React from 'react';
import TransactionsTable from '@/components/TransactionsTable';
import { Transaction } from '@/services/transactions';

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
  filters,
  onTransactionUpdated
}) => {
  return (
    <TransactionsTable 
      transactions={transactions}
      filters={filters}
      onTransactionUpdated={onTransactionUpdated}
    />
  );
};

export default DashboardTransactions;
