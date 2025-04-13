
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  };
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onFilterChange('customDate', format(selectedDate, 'yyyy-MM-dd'));
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-8 px-2"
        >
          <X className="h-4 w-4 mr-1" />
          Limpar filtros
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Pesquisar</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Descrição, valor..."
              value={filters.searchTerm || ''}
              onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange('category', value)}
          >
            <SelectTrigger id="category">
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
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange('type', value)}
          >
            <SelectTrigger id="type">
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
        <div className="space-y-2">
          <Label htmlFor="dateRange">Período</Label>
          <Select
            value={filters.dateRange}
            onValueChange={(value) => onFilterChange('dateRange', value)}
          >
            <SelectTrigger id="dateRange">
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
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
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
        <div className="space-y-2 md:col-span-2">
          <Label>Faixa de valor</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Valor mínimo"
              value={filters.minAmount}
              onChange={(e) => onFilterChange('minAmount', e.target.value)}
            />
            <span>a</span>
            <Input
              type="number"
              placeholder="Valor máximo"
              value={filters.maxAmount}
              onChange={(e) => onFilterChange('maxAmount', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
