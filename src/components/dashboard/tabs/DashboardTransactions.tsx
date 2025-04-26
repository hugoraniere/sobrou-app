
import React from 'react';
import TransactionsTable from '@/components/TransactionsTable';
import FilterBar from '@/components/FilterBar';
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
    <div className="space-y-6">
      <FilterBar 
        filters={filters}
        onFilterChange={() => {}}
        categories={[]}
        onResetFilters={() => {}}
      />
      <TransactionsTable 
        transactions={transactions}
        filters={filters}
        onTransactionUpdated={onTransactionUpdated}
      />
    </div>
  );
};

export default DashboardTransactions;
