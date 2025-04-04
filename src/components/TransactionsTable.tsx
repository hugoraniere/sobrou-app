
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Transaction } from '../services/TransactionService';

interface TransactionsTableProps {
  transactions: Transaction[];
  filters: {
    category: string;
    type: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
  };
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions,
  filters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
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
    
    // Filter by date range is handled elsewhere (when fetching transactions)
    
    return true;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="w-full overflow-auto">
      {filteredTransactions.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No transactions found with the current filters.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-full">Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {currentPage === 1 ? (
                      <PaginationPrevious className="pointer-events-none opacity-50" />
                    ) : (
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      />
                    )}
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          isActive={pageNumber === currentPage}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <PaginationItem>
                      <span className="px-2">...</span>
                    </PaginationItem>
                  )}
                  
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={totalPages === currentPage}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    {currentPage === totalPages ? (
                      <PaginationNext className="pointer-events-none opacity-50" />
                    ) : (
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      />
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionsTable;
