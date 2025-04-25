
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
          {t('transactions.date', 'Data')} {renderSortIcon('date')}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('type')}
        >
          {t('transactions.type', 'Tipo')} {renderSortIcon('type')}
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort('category')}
        >
          {t('transactions.category', 'Categoria')} {renderSortIcon('category')}
        </TableHead>
        <TableHead 
          className="w-full cursor-pointer"
          onClick={() => onSort('description')}
        >
          {t('transactions.description', 'Descrição')} {renderSortIcon('description')}
        </TableHead>
        <TableHead 
          className="text-right cursor-pointer"
          onClick={() => onSort('amount')}
        >
          {t('transactions.amount', 'Valor')} {renderSortIcon('amount')}
        </TableHead>
        <TableHead className="w-[100px] text-center">
          {t('transactions.actions', 'Ações')}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TransactionTableHeader;

