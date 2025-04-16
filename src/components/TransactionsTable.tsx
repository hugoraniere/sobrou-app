
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Transaction, TransactionService } from '../services/TransactionService';
import TransactionTableHeader from './transactions/TransactionTableHeader';
import TransactionRow from './transactions/TransactionRow';
import TransactionPagination from './transactions/TransactionPagination';
import { useTransactionSorter } from '@/hooks/useTransactionSorter';
import { useTransactionFilter } from '@/hooks/useTransactionFilter';
import { toast } from "sonner";

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
  
  const { sortConfig, handleSort, sortedTransactions } = useTransactionSorter('date', 'desc');
  const { 
    filteredTransactions, 
    filterState, 
    handleFilterChange, 
    handleResetFilters 
  } = useTransactionFilter(transactions, initialFilters);
  
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
  
  // Reset page when filters change
  const handleFilterChangeWithPageReset = (key: string, value: string) => {
    handleFilterChange(key, value);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Toggle recurring status
  const handleToggleRecurring = async (id: string, isRecurring: boolean) => {
    try {
      // Call the service to update the transaction
      await TransactionService.updateTransaction(id, { is_recurring: isRecurring });
      toast.success(isRecurring ? "Transação marcada como recorrente" : "Transação desmarcada como recorrente");
      onTransactionUpdated();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error("Falha ao atualizar transação");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="w-full overflow-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Suas Transações</h3>
          
          {/* Removed filter as requested */}
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
