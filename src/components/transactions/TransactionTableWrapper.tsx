
import React from 'react';
import { Table } from "@/components/ui/table";
import TransactionTableHeader from './TransactionTableHeader';
import type { Transaction } from '@/types/component-types';
import { SortConfig } from '@/hooks/useTransactionSorter';

interface TransactionTableWrapperProps {
  children: React.ReactNode;
  sortConfig: SortConfig;
  onSort: (key: keyof Transaction) => void;
}

const TransactionTableWrapper: React.FC<TransactionTableWrapperProps> = ({
  children,
  sortConfig,
  onSort,
}) => {
  return (
    <Table>
      <TransactionTableHeader 
        sortConfig={sortConfig}
        onSort={onSort}
      />
      {children}
    </Table>
  );
};

export default TransactionTableWrapper;
