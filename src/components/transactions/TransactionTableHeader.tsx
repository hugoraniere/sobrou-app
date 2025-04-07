
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Transaction } from '@/services/TransactionService';

type SortConfig = {
  key: keyof Transaction | '';
  direction: 'asc' | 'desc';
};

interface TransactionTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: keyof Transaction) => void;
}

const TransactionTableHeader: React.FC<TransactionTableHeaderProps> = ({ 
  sortConfig, 
  onSort 
}) => {
  // Render sort icon
  const renderSortIcon = (key: keyof Transaction) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="inline h-4 w-4" /> : 
      <ChevronDown className="inline h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('date')}
        >
          Date {renderSortIcon('date')}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('type')}
        >
          Type {renderSortIcon('type')}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('category')}
        >
          Category {renderSortIcon('category')}
        </TableHead>
        <TableHead 
          className="w-full cursor-pointer"
          onClick={() => onSort('description')}
        >
          Description {renderSortIcon('description')}
        </TableHead>
        <TableHead 
          className="text-right cursor-pointer"
          onClick={() => onSort('amount')}
        >
          Amount {renderSortIcon('amount')}
        </TableHead>
        <TableHead className="w-10">Recurring</TableHead>
        <TableHead className="w-10">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TransactionTableHeader;
