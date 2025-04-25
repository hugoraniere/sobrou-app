
import React from 'react';
import { Transaction } from '@/services/TransactionService';
import { useTransactionSorter } from '@/hooks/useTransactionSorter';
import TableFilters from './transactions/TableFilters';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { useTransactionList } from '@/hooks/useTransactionList';
import TransactionTableContent from './transactions/TransactionTableContent';

interface TransactionsTableProps {
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

const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions,
  filters: initialFilters,
  onTransactionUpdated
}) => {
  const {
    currentPage,
    setCurrentPage,
    transactionsState,
    setTransactionsState,
    getPaginatedTransactions,
    formatDate
  } = useTransactionList(transactions);
  
  const { sortConfig, handleSort, sortedTransactions } = useTransactionSorter('date', 'desc');
  const { filters, handleFilterChange, handleResetFilters } = useTransactionFilters(initialFilters);
  
  const filteredTransactions = React.useMemo(() => {
    return transactionsState.filter(transaction => {
      if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }

      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      if (filters.dateRange && filters.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        
        if (filters.dateRange === 'thisMonth') {
          if (transactionDate.getMonth() !== now.getMonth() || 
              transactionDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (filters.dateRange === 'lastMonth') {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          
          if (transactionDate.getMonth() !== lastMonth || 
              transactionDate.getFullYear() !== lastMonthYear) {
            return false;
          }
        } else if (filters.dateRange === 'thisYear') {
          if (transactionDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }

      if (filters.minAmount && parseFloat(filters.minAmount) > transaction.amount) {
        return false;
      }

      if (filters.maxAmount && parseFloat(filters.maxAmount) < transaction.amount) {
        return false;
      }

      return true;
    });
  }, [transactionsState, filters]);
  
  const sortedFilteredTransactions = sortedTransactions(filteredTransactions);
  const { paginatedTransactions, totalPages } = getPaginatedTransactions(sortedFilteredTransactions);
  
  const handleToggleRecurring = async (id: string, isRecurring: boolean) => {
    setTransactionsState(prevState => 
      prevState.map(transaction => 
        transaction.id === id 
          ? { ...transaction, is_recurring: isRecurring } 
          : transaction
      )
    );
  };
  
  return (
    <div>
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold mb-4">Suas Transações</h3>
        
        <TableFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      </div>
      
      <div className="pt-6">
        <TransactionTableContent
          filteredTransactions={filteredTransactions}
          paginatedTransactions={paginatedTransactions}
          totalPages={totalPages}
          currentPage={currentPage}
          sortConfig={sortConfig}
          onSort={handleSort}
          onPageChange={setCurrentPage}
          onToggleRecurring={handleToggleRecurring}
          formatDate={formatDate}
          onTransactionUpdated={onTransactionUpdated}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
