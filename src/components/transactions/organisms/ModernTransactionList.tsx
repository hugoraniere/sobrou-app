
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import TransactionItem from '../molecules/TransactionItem';
import EditTransactionDialog from '../../transactions/EditTransactionDialog';
import DeleteTransactionDialog from '../../transactions/DeleteTransactionDialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useModernTransactionList } from '@/hooks/useModernTransactionList';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import MonthNavigator from '../molecules/MonthNavigator';
import FilterBadge from '../molecules/FilterBadge';
import { Input } from '@/components/ui/input';
import { Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    applyPeriodFilter,
    clearPeriodFilter,
    isPeriodFilterActive,
    periodFilter,
    searchTerm,
    updateSearchTerm,
    showAllTransactions,
    toggleShowAllTransactions
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

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    updateSearchTerm('');
  };
  
  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Filtros e pesquisa - reorganizados: busca à esquerda, filtro de mês à direita */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        {/* Pesquisa de transações - agora à esquerda */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Filtro de mês - agora à direita */}
        <div className="flex items-center justify-end">
          <MonthNavigator 
            currentDate={currentMonth} 
            onDateChange={setCurrentMonth}
          />
        </div>
      </div>
      
      {/* Removi o filtro personalizado por enquanto */}
      
      {/* Lista de transações */}
      {filteredTransactions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center p-6">
          <p className="text-xl font-medium text-gray-900 mb-2">Nenhuma transação encontrada</p>
          <p className="text-gray-500">Não há transações para o período selecionado.</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
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
