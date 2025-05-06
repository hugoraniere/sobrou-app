
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transactionCategories } from '@/data/categories';
import { useTranslation } from 'react-i18next';
import type { TransactionFilters } from '@/hooks/useTransactionFilters';
import ImportBankStatementButton from './ImportBankStatementButton';
import { Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TableFiltersProps {
  filters: TransactionFilters;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  onTransactionsAdded: () => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onTransactionsAdded
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const hasActiveFilters = 
    filters.type !== 'all' || 
    filters.category !== 'all' || 
    filters.dateRange !== 'all' || 
    !!filters.minAmount || 
    !!filters.maxAmount;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Suas Transações</h3>
        
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={`flex items-center gap-2 ${hasActiveFilters ? 'border-primary text-primary' : ''}`}
              >
                <Filter className="h-4 w-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="bg-gray-100 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {/* Ícone indicativo sem exclamação */}
                    ✓
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4" align="end">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Opções de Filtro</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      onResetFilters();
                      setOpen(false);
                    }}
                    className="h-8 px-2 text-sm"
                  >
                    Limpar
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tipo</label>
                      <Select
                        value={filters.type}
                        onValueChange={(value) => onFilterChange('type', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os tipos</SelectItem>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Período</label>
                      <Select
                        value={filters.dateRange}
                        onValueChange={(value) => onFilterChange('dateRange', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as datas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as datas</SelectItem>
                          <SelectItem value="thisMonth">Este mês</SelectItem>
                          <SelectItem value="lastMonth">Mês anterior</SelectItem>
                          <SelectItem value="thisYear">Este ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Categoria</label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => onFilterChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {transactionCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              {category.icon && <category.icon className="h-4 w-4" />}
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Valor</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minAmount}
                        onChange={(e) => onFilterChange('minAmount', e.target.value)}
                        className="w-1/2"
                      />
                      <span className="text-gray-500">até</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxAmount}
                        onChange={(e) => onFilterChange('maxAmount', e.target.value)}
                        className="w-1/2"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-2" 
                  onClick={() => setOpen(false)}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <ImportBankStatementButton onTransactionsAdded={onTransactionsAdded} />
        </div>
      </div>
    </div>
  );
};

export default TableFilters;
