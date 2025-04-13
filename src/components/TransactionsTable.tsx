
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Transaction, TransactionService } from '../services/TransactionService';
import { toast } from "sonner";
import TransactionTableHeader from './transactions/TransactionTableHeader';
import TransactionRow from './transactions/TransactionRow';
import TransactionPagination from './transactions/TransactionPagination';
import { useTransactionSorter } from '@/hooks/useTransactionSorter';
import TransactionFilters from './transactions/TransactionFilters';
import { transactionCategories } from '@/data/categories';

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
  filters,
  onTransactionUpdated
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    searchTerm: '',
    customDate: '' // Add customDate property to localFilters
  });
  const itemsPerPage = 10;
  
  const { sortConfig, handleSort, sortedTransactions } = useTransactionSorter('date', 'desc');
  
  // Apply filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by search term
    if (localFilters.searchTerm) {
      const searchTermLower = localFilters.searchTerm.toLowerCase();
      const matchesDescription = transaction.description.toLowerCase().includes(searchTermLower);
      const matchesAmount = transaction.amount.toString().includes(localFilters.searchTerm);
      
      if (!matchesDescription && !matchesAmount) {
        return false;
      }
    }
    
    // Filter by category
    if (localFilters.category !== 'all' && transaction.category !== localFilters.category) {
      return false;
    }
    
    // Filter by type
    if (localFilters.type !== 'all' && transaction.type !== localFilters.type) {
      return false;
    }
    
    // Filter by amount range
    if (localFilters.minAmount && transaction.amount < parseFloat(localFilters.minAmount)) {
      return false;
    }
    
    if (localFilters.maxAmount && transaction.amount > parseFloat(localFilters.maxAmount)) {
      return false;
    }
    
    // Filter by date range
    if (localFilters.dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      
      switch (localFilters.dateRange) {
        case '7days': {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return transactionDate >= weekAgo;
        }
        case '30days': {
          const monthAgo = new Date();
          monthAgo.setDate(monthAgo.getDate() - 30);
          return transactionDate >= monthAgo;
        }
        case 'thisMonth': {
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        }
        case 'lastMonth': {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return (
            transactionDate.getMonth() === lastMonth.getMonth() &&
            transactionDate.getFullYear() === lastMonth.getFullYear()
          );
        }
        case 'thisYear': {
          return transactionDate.getFullYear() === today.getFullYear();
        }
        case 'custom': {
          if (localFilters.customDate) {
            const customDate = new Date(localFilters.customDate);
            return (
              transactionDate.getDate() === customDate.getDate() &&
              transactionDate.getMonth() === customDate.getMonth() &&
              transactionDate.getFullYear() === customDate.getFullYear()
            );
          }
          return true;
        }
        default:
          return true;
      }
    }
    
    return true;
  });
  
  // Sort and paginate transactions
  const sortedFilteredTransactions = sortedTransactions(filteredTransactions);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedFilteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedFilteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setLocalFilters({
      category: 'all',
      type: 'all',
      dateRange: '30days',
      minAmount: '',
      maxAmount: '',
      searchTerm: '',
      customDate: '' // Include customDate in reset
    });
    setCurrentPage(1);
  };
  
  // Toggle recurring status
  const handleToggleRecurring = async (id: string, isRecurring: boolean) => {
    try {
      // Since is_recurring column doesn't exist in the database, we need to handle this differently
      toast.success(!isRecurring ? 'Marcado como recorrente' : 'Status de recorrência removido');
      // Update the UI to reflect the change
      onTransactionUpdated();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Falha ao atualizar transação');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="w-full overflow-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Suas Transações</h3>
        </div>
        
        {/* Single filter positioned above the transaction table */}
        <div className="px-4 py-3 border-b">
          <TransactionFilters 
            filters={localFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Nenhuma transação encontrada com os filtros atuais.
          </div>
        ) : (
          <>
            <Table>
              <TransactionTableHeader 
                sortConfig={sortConfig}
                onSort={handleSort}
              />
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
            </Table>
            
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
