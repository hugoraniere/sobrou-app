
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
import { Transaction, TransactionService } from '../services/TransactionService';
import { 
  ChevronDown, 
  ChevronUp, 
  RepeatIcon,
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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

type SortConfig = {
  key: keyof Transaction | '';
  direction: 'asc' | 'desc';
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions,
  filters,
  onTransactionUpdated
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
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
    
    return true;
  });
  
  // Sort transactions
  const sortedTransactions = React.useMemo(() => {
    if (!sortConfig.key) return filteredTransactions;
    
    return [...filteredTransactions].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTransactions, sortConfig]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Handle sort
  const handleSort = (key: keyof Transaction) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Render sort icon
  const renderSortIcon = (key: keyof Transaction) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />;
  };
  
  // Toggle recurring status
  const handleToggleRecurring = async (id: string, isRecurring: boolean) => {
    try {
      await TransactionService.updateTransaction(id, { 
        is_recurring: !isRecurring,
        recurrence_interval: !isRecurring ? 'monthly' : undefined
      });
      onTransactionUpdated();
      toast.success(!isRecurring ? 'Marked as recurring' : 'Removed recurring status');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };
  
  return (
    <div className="w-full overflow-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Your Transactions</h3>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No transactions found with the current filters.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date {renderSortIcon('date')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  Type {renderSortIcon('type')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  Category {renderSortIcon('category')}
                </TableHead>
                <TableHead 
                  className="w-full cursor-pointer"
                  onClick={() => handleSort('description')}
                >
                  Description {renderSortIcon('description')}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  Amount {renderSortIcon('amount')}
                </TableHead>
                <TableHead className="w-10">Recurring</TableHead>
                <TableHead className="w-10">Actions</TableHead>
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
                  <TableCell>
                    {transaction.is_recurring && (
                      <div className="flex items-center justify-center">
                        <RepeatIcon className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleToggleRecurring(transaction.id, !!transaction.is_recurring)}
                        >
                          {transaction.is_recurring ? 'Remove recurring' : 'Mark as recurring'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                    />
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
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                    />
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
