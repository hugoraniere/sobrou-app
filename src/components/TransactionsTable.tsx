
import React from 'react';
import { Transaction } from '@/services/transactions';
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
    itemsPerPage,
    setItemsPerPage,
    transactionsState,
    setTransactionsState,
    getPaginatedTransactions,
    formatDate
  } = useTransactionList(transactions);
  
  // Initialize with date sorting in descending order
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
  const { paginatedTransactions, totalPages, totalItems } = getPaginatedTransactions(sortedFilteredTransactions);
  
  const handleToggleRecurring = async (id: string, isRecurring: boolean) => {
    setTransactionsState(prevState => 
      prevState.map(transaction => 
        transaction.id === id 
          ? { ...transaction, is_recurring: isRecurring } 
          : transaction
      )
    );
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
  };
  
  return (
    <div className="space-y-4">
      <div className="w-full overflow-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <TableFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onTransactionsAdded={onTransactionUpdated}
          />
        </div>
        
        <TransactionTableContent
          filteredTransactions={filteredTransactions}
          paginatedTransactions={paginatedTransactions}
          totalPages={totalPages}
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          sortConfig={sortConfig}
          onSort={handleSort}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onToggleRecurring={handleToggleRecurring}
          formatDate={formatDate}
          onTransactionUpdated={onTransactionUpdated}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
