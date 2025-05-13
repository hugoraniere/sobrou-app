
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import TransactionsHeader from '../molecules/TransactionsHeader';
import TransactionItem from '../molecules/TransactionItem';
import EditTransactionDialog from '../../transactions/EditTransactionDialog';
import DeleteTransactionDialog from '../../transactions/DeleteTransactionDialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useModernTransactionList } from '@/hooks/useModernTransactionList';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  // Log para debugging da propriedade de transações recebida
  console.log(`ModernTransactionList recebeu ${transactions.length} transações`);
  
  const {
    currentDate,
    selectedFilter,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    currentPage,
    hasTransactionsInNextMonth,
    handleFilterChange,
    handleDateChange,
    setCurrentPage
  } = useModernTransactionList(transactions);
  
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // Log para debugging das transações filtradas
  useEffect(() => {
    console.log(`Transações filtradas: ${filteredTransactions.length}, paginadas: ${paginatedTransactions.length}`);
  }, [filteredTransactions.length, paginatedTransactions.length]);
  
  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
  };
  
  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <TransactionsHeader
        currentDate={currentDate}
        onDateChange={handleDateChange}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        hasTransactionsInNextMonth={hasTransactionsInNextMonth}
        className="w-full"
      />
      
      {filteredTransactions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center p-6">
          <p className="text-xl font-medium text-gray-900 mb-2">Nenhuma transação encontrada</p>
          <p className="text-gray-500">Não há transações para o período selecionado.</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4"> {/* Garantindo espaço de 16px entre cada card */}
            {paginatedTransactions.map((transaction) => (
              <Card key={transaction.id} className="overflow-hidden">
                <TransactionItem
                  transaction={transaction}
                  onEdit={() => handleEdit(transaction)}
                  onDelete={() => handleDelete(transaction.id)}
                />
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer rounded-full"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  // Simplified pagination display
                  let pageNum;
                  
                  if (totalPages <= 5) {
                    // Show all pages if 5 or fewer
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // At start, show first 5 pages
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // At end, show last 5 pages
                    pageNum = totalPages - 4 + i;
                  } else {
                    // In middle, show current page and 2 pages before/after
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className="cursor-pointer rounded-full"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer rounded-full"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
      
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
