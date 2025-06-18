
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YearSelectorProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  className?: string;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  currentYear,
  onYearChange,
  className
}) => {
  const currentCalendarYear = new Date().getFullYear();
  const minYear = currentCalendarYear - 5;
  const maxYear = currentCalendarYear + 2;

  const handlePreviousYear = () => {
    if (currentYear > minYear) {
      onYearChange(currentYear - 1);
    }
  };

  const handleNextYear = () => {
    if (currentYear < maxYear) {
      onYearChange(currentYear + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousYear}
        disabled={currentYear <= minYear}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-2xl font-bold text-gray-900 min-w-[80px] text-center">
        {currentYear}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextYear}
        disabled={currentYear >= maxYear}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
