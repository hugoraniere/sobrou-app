
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
        <ChevronUp className="w-4 h-4 ml-1 transition-opacity opacity-0 group-hover:opacity-30" />
      );
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="group cursor-pointer min-w-[100px] whitespace-nowrap px-6 hover:text-primary flex items-center"
          onClick={() => onSort('date')}
        >
          <span className="flex items-center">
            {t('transactions.date', 'Data')} {renderSortIcon('date')}
          </span>
        </TableHead>
        <TableHead 
          className="group cursor-pointer min-w-[100px] whitespace-nowrap px-6 hover:text-primary flex items-center"
          onClick={() => onSort('type')}
        >
          <span className="flex items-center">
            {t('transactions.type', 'Tipo')} {renderSortIcon('type')}
          </span>
        </TableHead>
        <TableHead 
          className="group cursor-pointer min-w-[140px] whitespace-nowrap px-6 hover:text-primary flex items-center"
          onClick={() => onSort('category')}
        >
          <span className="flex items-center">
            {t('transactions.category', 'Categoria')} {renderSortIcon('category')}
          </span>
        </TableHead>
        <TableHead 
          className="group min-w-[200px] cursor-pointer px-6 hover:text-primary flex items-center"
          onClick={() => onSort('description')}
        >
          <span className="flex items-center">
            {t('transactions.description', 'Descrição')} {renderSortIcon('description')}
          </span>
        </TableHead>
        <TableHead 
          className="group text-right cursor-pointer w-[160px] whitespace-nowrap px-6 hover:text-primary flex items-center justify-end"
          onClick={() => onSort('amount')}
        >
          <span className="flex items-center">
            {t('transactions.amount', 'Valor')} {renderSortIcon('amount')}
          </span>
        </TableHead>
        <TableHead className="w-[100px] text-center whitespace-nowrap px-6">
          {t('transactions.actions', 'Ações')}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TransactionTableHeader;
