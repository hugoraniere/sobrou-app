import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type BillsPeriodFilter = 'today' | 'this-week' | 'this-month' | 'custom-month' | 'always';

interface BillsPeriodFiltersProps {
  periodFilter: BillsPeriodFilter;
  onPeriodFilterChange: (filter: BillsPeriodFilter) => void;
  customMonth: string;
  onCustomMonthChange: (month: string) => void;
}

export const BillsPeriodFilters: React.FC<BillsPeriodFiltersProps> = ({
  periodFilter,
  onPeriodFilterChange,
  customMonth,
  onCustomMonthChange,
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
    { value: 'always', label: 'Sempre' },
    { value: 'today', label: 'Hoje' },
    { value: 'this-week', label: 'Esta Semana' },
    { value: 'this-month', label: 'Este Mês' },
    { value: 'custom-month', label: 'Filtrar Mês' },
  ];

  return (
    <div className="flex flex-wrap gap-2" data-tour-id="bills-to-pay.filters.period-filters">
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
  );
};