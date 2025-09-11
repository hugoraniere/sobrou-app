import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from 'lucide-react';

export type AdminPeriodOption = '7-days' | '30-days' | '90-days' | '1-year';

interface PeriodSelectorProps {
  value: AdminPeriodOption;
  onValueChange: (value: AdminPeriodOption) => void;
}

const ADMIN_PERIOD_OPTIONS: Array<{ value: AdminPeriodOption; label: string }> = [
  { value: '7-days', label: 'Últimos 7 dias' },
  { value: '30-days', label: 'Últimos 30 dias' },
  { value: '90-days', label: 'Últimos 90 dias' },
  { value: '1-year', label: 'Último ano' }
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  value,
  onValueChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>
        <SelectContent>
          {ADMIN_PERIOD_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const getPeriodDays = (period: AdminPeriodOption): number => {
  switch (period) {
    case '7-days':
      return 7;
    case '30-days':
      return 30;
    case '90-days':
      return 90;
    case '1-year':
      return 365;
    default:
      return 30;
  }
};