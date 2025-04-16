
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';

interface TransactionFiltersProps {
  filters: {
    category: string;
    type: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <Select
          value={filters.type}
          onValueChange={(value) => onFilterChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('filters.typeAll', 'Todos os tipos')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.typeAll', 'Todos os tipos')}</SelectItem>
            <SelectItem value="income">{t('common.income', 'Receita')}</SelectItem>
            <SelectItem value="expense">{t('common.expense', 'Despesa')}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.dateRange}
          onValueChange={(value) => onFilterChange('dateRange', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('filters.dateAll', 'Todas as datas')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.dateAll', 'Todas as datas')}</SelectItem>
            <SelectItem value="thisMonth">{t('filters.thisMonth', 'Este mês')}</SelectItem>
            <SelectItem value="lastMonth">{t('filters.lastMonth', 'Último mês')}</SelectItem>
            <SelectItem value="thisYear">{t('filters.thisYear', 'Este ano')}</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-1">
          <Input
            type="number"
            placeholder={t('filters.minAmount', 'Valor mín.')}
            value={filters.minAmount}
            onChange={(e) => onFilterChange('minAmount', e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-1">
          <Input
            type="number"
            placeholder={t('filters.maxAmount', 'Valor máx.')}
            value={filters.maxAmount}
            onChange={(e) => onFilterChange('maxAmount', e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
        >
          {t('filters.reset', 'Limpar filtros')}
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
