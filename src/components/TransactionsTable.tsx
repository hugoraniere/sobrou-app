
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Transaction, TransactionService } from '../services/TransactionService';
import { toast } from "sonner";
import TransactionTableHeader from './transactions/TransactionTableHeader';
import TransactionRow from './transactions/TransactionRow';
import TransactionPagination from './transactions/TransactionPagination';
import { useTransactionSorter } from '@/hooks/useTransactionSorter';

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
  const itemsPerPage = 10;
  
  const { sortConfig, handleSort, sortedTransactions } = useTransactionSorter('date', 'desc');
  
  // Apply filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by category
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    
    // Filter by type
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Filter by amount range
    if (filters.minAmount && transaction.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    
    if (filters.maxAmount && transaction.amount > parseFloat(filters.maxAmount)) {
      return false;
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
  
  // Toggle recurring status
  const handleToggleRecurring = async (id: string, isRecurring: boolean) => {
    try {
      await TransactionService.updateTransaction(id, { 
        is_recurring: !isRecurring,
        recurrence_interval: !isRecurring ? 'monthly' : undefined
      });
      onTransactionUpdated();
      toast.success(!isRecurring ? 'Marcado como recorrente' : 'Status de recorrência removido');
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Falha ao atualizar transação');
    }
  };
  
  return (
    <div className="w-full overflow-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Suas Transações</h3>
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
  );
};

export default TransactionsTable;
