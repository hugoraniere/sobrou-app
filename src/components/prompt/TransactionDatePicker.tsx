
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TransactionDatePickerProps {
  date?: Date;
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

const TransactionDatePicker: React.FC<TransactionDatePickerProps> = ({
  date,
  selectedDate,
  onDateChange,
  className
}) => {
  const effectiveDate = date || selectedDate || new Date();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 p-0",
            className
          )}
          aria-label="Selecione uma data"
        >
          <CalendarIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
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
