import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type BillsPeriodFilter = 'today' | 'this-week' | 'this-month' | 'custom-month' | 'always';

interface BillsFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  periodFilter: BillsPeriodFilter;
  onPeriodFilterChange: (filter: BillsPeriodFilter) => void;
  customMonth: string;
  onCustomMonthChange: (month: string) => void;
  hidePaid: boolean;
  onHidePaidChange: (hide: boolean) => void;
  paidCount: number;
}

export const BillsFilterBar: React.FC<BillsFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  periodFilter,
  onPeriodFilterChange,
  customMonth,
  onCustomMonthChange,
  hidePaid,
  onHidePaidChange,
  paidCount,
}) => {
  const currentYear = new Date().getFullYear();
  const months = [
    { value: `${currentYear}-01`, label: 'Janeiro' },
    { value: `${currentYear}-02`, label: 'Fevereiro' },
    { value: `${currentYear}-03`, label: 'Março' },
    { value: `${currentYear}-04`, label: 'Abril' },
    { value: `${currentYear}-05`, label: 'Maio' },
    { value: `${currentYear}-06`, label: 'Junho' },
    { value: `${currentYear}-07`, label: 'Julho' },
    { value: `${currentYear}-08`, label: 'Agosto' },
    { value: `${currentYear}-09`, label: 'Setembro' },
    { value: `${currentYear}-10`, label: 'Outubro' },
    { value: `${currentYear}-11`, label: 'Novembro' },
    { value: `${currentYear}-12`, label: 'Dezembro' },
  ];

  const periodOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'this-week', label: 'Esta Semana' },
    { value: 'this-month', label: 'Este Mês' },
    { value: 'custom-month', label: 'Filtrar Mês' },
    { value: 'always', label: 'Sempre' },
  ];

  return (
    <div className="space-y-4">
      {/* Chips de período */}
      <div className="flex flex-wrap gap-2">
        {periodOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            size="sm"
            onClick={() => onPeriodFilterChange(option.value as BillsPeriodFilter)}
            className={cn(
              "h-8 px-3 text-xs",
              periodFilter === option.value
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "bg-background hover:bg-muted"
            )}
          >
            <Calendar className="h-3 w-3 mr-1.5" />
            {option.label}
          </Button>
        ))}
        
        {/* Dropdown de mês customizado */}
        {periodFilter === 'custom-month' && (
          <Select value={customMonth} onValueChange={onCustomMonthChange}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Selecionar mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Campo de busca e toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Campo de busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conta por nome..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Toggle de contas pagas */}
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <Switch 
            id="hide-paid" 
            checked={!hidePaid}
            onCheckedChange={(checked) => onHidePaidChange(!checked)}
          />
          <Label htmlFor="hide-paid" className="text-sm">
            Mostrar pagas ({paidCount})
          </Label>
        </div>
      </div>
    </div>
  );
};