
import React, { useState, useEffect } from 'react';
import { format, startOfToday, startOfMonth, subDays, startOfYear } from 'date-fns';
import { Transaction } from '@/services/transactions';
import TransactionsHeader from '../molecules/TransactionsHeader';
import TransactionItem from '../molecules/TransactionItem';
import EditTransactionDialog from '../../transactions/EditTransactionDialog';
import DeleteTransactionDialog from '../../transactions/DeleteTransactionDialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('thisMonth');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // Items per page
  const itemsPerPage = 10;
  
  // Apply filters based on the selected quick filter or date
  useEffect(() => {
    let filtered = [...transactions];
    const today = startOfToday();
    
    // Apply quick filter
    switch (selectedFilter) {
      case 'today':
        filtered = filtered.filter(tx => 
          format(new Date(tx.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        );
        break;
      case '7days':
        const sevenDaysAgo = subDays(today, 7);
        filtered = filtered.filter(tx => 
          new Date(tx.date) >= sevenDaysAgo
        );
        break;
      case 'thisMonth':
        const firstDayOfMonth = startOfMonth(currentDate);
        const lastDayOfMonth = new Date(
          currentDate.getFullYear(), 
          currentDate.getMonth() + 1, 
          0
        );
        
        filtered = filtered.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate >= firstDayOfMonth && txDate <= lastDayOfMonth;
        });
        break;
      case 'thisYear':
        const firstDayOfYear = startOfYear(currentDate);
        const lastDayOfYear = new Date(
          currentDate.getFullYear(), 
          11, 
          31
        );
        
        filtered = filtered.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate >= firstDayOfYear && txDate <= lastDayOfYear;
        });
        break;
      default:
        break;
    }
    
    // Sort by date, newest first
    filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [transactions, selectedFilter, currentDate]);
  
  // Check if there are transactions in the next month
  const hasTransactionsInNextMonth = transactions.some(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === (currentDate.getMonth() + 1) % 12;
  });
  
  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
  };
  
  // Handle date change
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex, 
    startIndex + itemsPerPage
  );
  
  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <TransactionsHeader
        currentDate={currentDate}
        onDateChange={handleDateChange}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        hasTransactionsInNextMonth={hasTransactionsInNextMonth}
        className="mb-6"
      />
      
      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xl font-medium text-gray-900 mb-2">Nenhuma transação encontrada</p>
          <p className="text-gray-500">Não há transações para o período selecionado.</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden bg-white">
            {paginatedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={() => handleEdit(transaction)}
                onDelete={() => handleDelete(transaction.id)}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
