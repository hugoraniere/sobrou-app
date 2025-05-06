
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { Transaction } from '@/services/transactions';
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
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="h-4 w-4 transition-opacity" /> : 
        <ChevronDown className="h-4 w-4 transition-opacity" />;
    }
    return <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity duration-200" />;
  };

  const renderHeaderContent = (key: keyof Transaction, label: string, align: 'start' | 'center' | 'end' = 'start') => (
    <button
      onClick={() => onSort(key)}
      className={`flex items-center w-full gap-4 group cursor-pointer ${align === 'end' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}
    >
      <span>{label}</span>
      <span className={`inline-flex ${sortConfig.key === key ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}>
        {renderSortIcon(key)}
      </span>
    </button>
  );

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-[100px] whitespace-nowrap group">
          {renderHeaderContent('date', t('transactions.date', 'Data'))}
        </TableHead>
        <TableHead className="min-w-[100px] whitespace-nowrap group">
          {renderHeaderContent('type', t('transactions.type', 'Tipo'))}
        </TableHead>
        <TableHead className="min-w-[140px] whitespace-nowrap group">
          {renderHeaderContent('category', t('transactions.category', 'Categoria'))}
        </TableHead>
        <TableHead className="min-w-[200px] group">
          {renderHeaderContent('description', t('transactions.description', 'Descrição'))}
        </TableHead>
        <TableHead className="text-left w-[160px] whitespace-nowrap group">
          {renderHeaderContent('amount', t('transactions.amount', 'Valor'), 'start')}
        </TableHead>
        <TableHead className="w-[100px] text-center whitespace-nowrap">
          {t('transactions.actions', 'Ações')}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TransactionTableHeader;
