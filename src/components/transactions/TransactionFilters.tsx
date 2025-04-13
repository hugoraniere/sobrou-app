
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { transactionCategories } from '@/data/categories';
import { Calendar, Search, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TransactionFiltersProps {
  filters: {
    category: string;
    type: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
    searchTerm?: string;
    customDate?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    filters.customDate ? new Date(filters.customDate) : new Date()
  );
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onFilterChange('customDate', format(selectedDate, 'yyyy-MM-dd'));
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Filtros</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-8 px-2 text-xs"
        >
          <X className="h-3 w-3 mr-1" />
          Limpar filtros
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={filters.searchTerm || ''}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            className="pl-8"
          />
        </div>
        
        {/* Category Filter */}
        <div>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {transactionCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Transaction Type */}
        <div>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos tipos</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="transfer">Transferências</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Range */}
        <div>
          <Select
            value={filters.dateRange}
            onValueChange={(value) => onFilterChange('dateRange', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo período</SelectItem>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="thisMonth">Este mês</SelectItem>
              <SelectItem value="lastMonth">Mês passado</SelectItem>
              <SelectItem value="thisYear">Este ano</SelectItem>
              <SelectItem value="custom">Data específica</SelectItem>
            </SelectContent>
          </Select>
          
          {filters.dateRange === 'custom' && (
            <div className="mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd/MM/yyyy') : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        
        {/* Amount Range */}
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minAmount}
            onChange={(e) => onFilterChange('minAmount', e.target.value)}
            className="w-full"
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxAmount}
            onChange={(e) => onFilterChange('maxAmount', e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
