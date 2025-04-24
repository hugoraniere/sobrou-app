
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transactionCategories } from '@/data/categories';
import { useTranslation } from 'react-i18next';
import type { TransactionFilters } from '@/hooks/useTransactionFilters';

interface TableFiltersProps {
  filters: TransactionFilters;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-4">
      <Select
        value={filters.type}
        onValueChange={(value) => onFilterChange('type', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="income">Receita</SelectItem>
          <SelectItem value="expense">Despesa</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={filters.category}
        onValueChange={(value) => onFilterChange('category', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent className="bg-white max-h-[300px]">
          <SelectItem value="all">Todas as categorias</SelectItem>
          {transactionCategories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={filters.dateRange}
        onValueChange={(value) => onFilterChange('dateRange', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas as datas" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Todas as datas</SelectItem>
          <SelectItem value="thisMonth">Este mês</SelectItem>
          <SelectItem value="lastMonth">Mês anterior</SelectItem>
          <SelectItem value="thisYear">Este ano</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Valor mínimo"
          value={filters.minAmount}
          onChange={(e) => onFilterChange('minAmount', e.target.value)}
        />
        <Input
          type="number"
          placeholder="Valor máximo"
          value={filters.maxAmount}
          onChange={(e) => onFilterChange('maxAmount', e.target.value)}
        />
      </div>
      
      <Button 
        variant="outline" 
        onClick={onResetFilters}
      >
        Limpar filtros
      </Button>
    </div>
  );
};

export default TableFilters;
