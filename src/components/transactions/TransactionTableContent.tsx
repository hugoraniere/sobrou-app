
import React from 'react';
import { TableBody } from "@/components/ui/table";
import { Transaction } from '@/services/TransactionService';
import TransactionRow from './TransactionRow';
import TransactionPagination from './TransactionPagination';
import EmptyTransactions from './EmptyTransactions';
import TransactionTableWrapper from './TransactionTableWrapper';
import { SortConfig } from '@/hooks/useTransactionSorter';

interface TransactionTableContentProps {
  filteredTransactions: Transaction[];
  paginatedTransactions: Transaction[];
  totalPages: number;
  currentPage: number;
  sortConfig: SortConfig;
  onSort: (key: keyof Transaction) => void;
  onPageChange: (page: number) => void;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
  onTransactionUpdated: () => void;
}

const TransactionTableContent: React.FC<TransactionTableContentProps> = ({
  filteredTransactions,
  paginatedTransactions,
  totalPages,
  currentPage,
  sortConfig,
  onSort,
  onPageChange,
  onToggleRecurring,
  formatDate,
  onTransactionUpdated,
}) => {
  if (filteredTransactions.length === 0) {
    return <EmptyTransactions />;
  }

  return (
    <>
      <TransactionTableWrapper
        sortConfig={sortConfig}
        onSort={onSort}
      >
        <TableBody>
          {paginatedTransactions.map((transaction) => (
            <TransactionRow 
              key={transaction.id}
              transaction={transaction}
              onToggleRecurring={onToggleRecurring}
              formatDate={formatDate}
              onTransactionUpdated={onTransactionUpdated}
            />
          ))}
        </TableBody>
      </TransactionTableWrapper>
      
      <TransactionPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default TransactionTableContent;
