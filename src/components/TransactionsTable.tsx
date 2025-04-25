
import React, { useState, useEffect } from 'react';
import { TableBody } from "@/components/ui/table";
import { Transaction } from '../services/TransactionService';
import TransactionRow from './transactions/TransactionRow';
import TransactionPagination from './transactions/TransactionPagination';
import { useTransactionSorter } from '@/hooks/useTransactionSorter';
import TableFilters from './transactions/TableFilters';
import EmptyTransactions from './transactions/EmptyTransactions';
import TransactionTableWrapper from './transactions/TransactionTableWrapper';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [transactionsState, setTransactionsState] = useState<Transaction[]>(transactions);
  
  useEffect(() => {
    setTransactionsState(transactions);
  }, [transactions]);
  
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
  const totalPages = Math.ceil(sortedFilteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedFilteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
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
    <div className="space-y-4">
      <div className="w-full overflow-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold mb-4">Suas Transações</h3>
          
          <TableFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        {filteredTransactions.length === 0 ? (
          <EmptyTransactions />
        ) : (
          <>
            <TransactionTableWrapper
              sortConfig={sortConfig}
              onSort={handleSort}
            >
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TransactionRow 
                    key={transaction.id}
                    transaction={transaction}
                    onToggleRecurring={handleToggleRecurring}
                    formatDate={formatDate}
                    onTransactionUpdated={onTransactionUpdated}
                  />
                ))}
              </TableBody>
            </TransactionTableWrapper>
            
            <TransactionPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
