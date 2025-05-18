
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const currentYear = currentDate.getFullYear();
  const yearsToShow = 4; // Quantos anos mostrar no seletor
  
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
  
  // Controles de navegação do ano
  const goToPreviousYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() - 1);
    onDateChange(newDate);
  };

  const goToNextYear = () => {
    const newDate = new Date(currentDate);
    const nextYear = currentDate.getFullYear() + 1;
    
    // Não permitir anos futuros
    if (nextYear <= today.getFullYear()) {
      newDate.setFullYear(nextYear);
      onDateChange(newDate);
    }
  };

  // Verificar se pode navegar para o próximo ano
  const canGoToNextYear = currentYear < today.getFullYear();
  
  // Gerar lista de anos para seleção
  const generateYears = () => {
    const years = [];
    const startYear = Math.max(today.getFullYear() - yearsToShow + 1, 2020);
    
    for (let year = startYear; year <= today.getFullYear(); year++) {
      years.push(year);
    }
    
    return years;
  };
  
  // Lista de meses
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i, 1);
    // Não permitir meses futuros no ano atual
    const isFutureMonth = currentYear === today.getFullYear() && i > today.getMonth();
    
    return {
      value: i,
      label: format(date, 'MMMM', { locale: ptBR }),
      disabled: isFutureMonth
    };
  });
  
  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    
    // Se o mês selecionado é futuro para o ano selecionado, ajustar para o mês atual
    if (year === today.getFullYear() && newDate.getMonth() > today.getMonth()) {
      newDate.setMonth(today.getMonth());
    }
    
    onDateChange(newDate);
  };
  
  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentDate);
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
            className="flex items-center mx-1 px-3 py-1 h-auto text-base font-semibold hover:bg-gray-100 transition-colors rounded-md"
          >
            {capitalizedMonthName}
            {/* Removida a seta de dropdown */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto bg-white" align="center">
          {/* Navegação de ano no topo */}
          <div className="flex items-center justify-between p-2 border-b">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToPreviousYear}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Select 
              value={currentYear.toString()} 
              onValueChange={(value) => handleYearChange(parseInt(value, 10))}
            >
              <SelectTrigger className="w-[100px] h-8 border-0 font-semibold focus:ring-0">
                <SelectValue>{currentYear}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {generateYears().map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={goToNextYear}
              disabled={!canGoToNextYear}
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <DropdownMenuGroup>
            {months.map((month) => (
              <DropdownMenuItem 
                key={month.value}
                className={cn(
                  "cursor-pointer",
                  isSameMonth(new Date(currentYear, month.value), currentDate) && "bg-muted font-semibold",
                  month.disabled && "opacity-50 pointer-events-none"
                )}
                onClick={() => handleMonthSelect(month.value)}
                disabled={month.disabled}
              >
                {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
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
