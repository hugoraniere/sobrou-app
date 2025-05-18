
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import { useModernTransactionList } from '@/hooks/useModernTransactionList';
import { cn } from '@/lib/utils';

// Componentes refatorados
import TransactionListFilters from '../molecules/TransactionListFilters';
import TransactionListContent from '../molecules/TransactionListContent';
import TransactionPaginationControls from '../molecules/TransactionPaginationControls';
import EditTransactionDialog from '../EditTransactionDialog';
import DeleteTransactionDialog from '../DeleteTransactionDialog';

interface ModernTransactionListProps {
  transactions: Transaction[];
  onTransactionUpdated: () => void;
  className?: string;
}

const ModernTransactionList: React.FC<ModernTransactionListProps> = ({
  transactions,
  onTransactionUpdated,
  className
}) => {
  const {
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    currentPage,
    currentMonth,
    setCurrentPage,
    setCurrentMonth,
    searchTerm,
    updateSearchTerm
  } = useModernTransactionList(transactions);
  
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    console.log(`ModernTransactionList recebeu ${transactions.length} transações`);
  }, [transactions]);
  
  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
  };
  
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {/* Filtros e pesquisa */}
      <TransactionListFilters 
        currentMonth={currentMonth}
        searchTerm={searchTerm}
        onMonthChange={setCurrentMonth}
        onSearchChange={updateSearchTerm}
      />
      
      {/* Lista de transações */}
      <TransactionListContent 
        transactions={paginatedTransactions}
        onTransactionEdit={handleEdit}
        onTransactionDelete={handleDelete}
        isEmpty={filteredTransactions.length === 0}
      />
      
      {/* Paginação */}
      <TransactionPaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      {/* Dialogs */}
      {transactionToEdit && (
        <EditTransactionDialog
          isOpen={!!transactionToEdit}
          setIsOpen={() => setTransactionToEdit(null)}
          transaction={transactionToEdit}
          onTransactionUpdated={onTransactionUpdated}
        />
      )}
      
      {transactionToDelete && (
        <DeleteTransactionDialog
          isOpen={!!transactionToDelete}
          setIsOpen={() => setTransactionToDelete(null)}
          transactionId={transactionToDelete}
          onTransactionUpdated={onTransactionUpdated}
        />
      )}
    </div>
  );
};

export default ModernTransactionList;
