
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Transaction } from '@/services/TransactionService';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const renderSortIcon = (key: keyof Transaction) => {
    if (sortConfig.key !== key) {
      return (
        <ChevronUp className="ml-1 w-4 h-4 opacity-0 transition-opacity group-hover:opacity-30 inline-block" />
      );
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="ml-1 w-4 h-4 inline-block" /> : 
      <ChevronDown className="ml-1 w-4 h-4 inline-block" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="group cursor-pointer min-w-[100px] whitespace-nowrap px-6 hover:text-primary"
          onClick={() => onSort('date')}
        >
          {t('transactions.date', 'Data')} {renderSortIcon('date')}
        </TableHead>
        <TableHead 
          className="group cursor-pointer min-w-[100px] whitespace-nowrap px-6 hover:text-primary"
          onClick={() => onSort('type')}
        >
          {t('transactions.type', 'Tipo')} {renderSortIcon('type')}
        </TableHead>
        <TableHead 
          className="group cursor-pointer min-w-[140px] whitespace-nowrap px-6 hover:text-primary"
          onClick={() => onSort('category')}
        >
          {t('transactions.category', 'Categoria')} {renderSortIcon('category')}
        </TableHead>
        <TableHead 
          className="group cursor-pointer min-w-[200px] px-6 hover:text-primary"
          onClick={() => onSort('description')}
        >
          {t('transactions.description', 'Descrição')} {renderSortIcon('description')}
        </TableHead>
        <TableHead 
          className="group cursor-pointer w-[160px] whitespace-nowrap px-6 hover:text-primary text-right"
          onClick={() => onSort('amount')}
        >
          {t('transactions.amount', 'Valor')} {renderSortIcon('amount')}
        </TableHead>
        <TableHead className="w-[100px] text-center whitespace-nowrap px-6">
          {t('transactions.actions', 'Ações')}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TransactionTableHeader;
