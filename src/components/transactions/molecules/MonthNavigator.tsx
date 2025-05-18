
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react';
import { format, subMonths, addMonths, isSameMonth, isAfter, isBefore, setMonth, setYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MonthNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  hasTransactionsInNextMonth?: boolean;
  className?: string;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ 
  currentDate, 
  onDateChange,
  hasTransactionsInNextMonth,
  className 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const today = new Date();
  
  const goToPreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    // Verificar se o próximo mês não está no futuro
    if (!isAfter(nextMonth, today) || hasTransactionsInNextMonth) {
      onDateChange(nextMonth);
    }
  };
  
  // Check if next month is after today or if there are transactions in next month
  const canGoToNextMonth = hasTransactionsInNextMonth || !isAfter(addMonths(currentDate, 1), today);
  
  // Format month name with first letter capitalized
  const monthName = format(currentDate, 'MMMM yyyy', { locale: ptBR });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  // Gerar meses para dropdown (12 meses anteriores e mês atual)
  const generateMonthOptions = () => {
    const options = [];
    const currentYear = today.getFullYear();
    const startYear = currentYear - 3; // 3 anos para trás
    
    for (let year = startYear; year <= currentYear; year++) {
      const monthsInYear = year === currentYear ? today.getMonth() + 1 : 12;
      
      for (let month = 0; month < monthsInYear; month++) {
        const date = new Date(year, month, 1);
        options.push({
          year,
          month,
          label: format(date, 'MMMM', { locale: ptBR }).charAt(0).toUpperCase() + 
                 format(date, 'MMMM', { locale: ptBR }).slice(1) + 
                 ' ' + year
        });
      }
    }
    
    // Ordenar os meses mais recentes primeiro
    return options.reverse();
  };
  
  const monthOptions = generateMonthOptions();
  
  const handleMonthSelect = (year: number, month: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    newDate.setMonth(month);
    onDateChange(newDate);
    setDropdownOpen(false);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={goToPreviousMonth}
        className="h-8 w-8 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Mês anterior</span>
      </Button>
      
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 mx-1 px-2 py-1 h-auto text-base font-semibold"
          >
            {capitalizedMonthName}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto bg-white" align="center">
          <DropdownMenuGroup>
            {monthOptions.map((option) => (
              <DropdownMenuItem 
                key={`${option.year}-${option.month}`}
                className={cn(
                  "cursor-pointer",
                  isSameMonth(new Date(option.year, option.month), currentDate) && "bg-muted font-semibold"
                )}
                onClick={() => handleMonthSelect(option.year, option.month)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={goToNextMonth}
        disabled={!canGoToNextMonth}
        className="h-8 w-8 rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próximo mês</span>
      </Button>
    </div>
  );
};

export default MonthNavigator;
