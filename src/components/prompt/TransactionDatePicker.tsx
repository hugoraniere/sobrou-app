
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

interface TransactionDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

const TransactionDatePicker: React.FC<TransactionDatePickerProps> = ({
  selectedDate,
  onDateChange
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="text-gray-400 hover:text-gray-600">
          <CalendarIcon className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default TransactionDatePicker;
