
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TransactionDatePickerProps {
  date?: Date;
  selectedDate?: Date; // Added alternative prop name
  onDateChange: (date: Date) => void;
  className?: string;
}

const TransactionDatePicker: React.FC<TransactionDatePickerProps> = ({
  date,
  selectedDate, // Handle both prop names
  onDateChange,
  className
}) => {
  // Use either date or selectedDate prop, with date taking precedence
  const effectiveDate = date || selectedDate || new Date();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !effectiveDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {effectiveDate ? format(effectiveDate, 'PPP') : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={effectiveDate}
          onSelect={(date) => date && onDateChange(date)}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default TransactionDatePicker;
