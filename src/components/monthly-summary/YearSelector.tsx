
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
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
  const { isMobile } = useResponsive();
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
    <div className={cn(
      "flex items-center",
      isMobile ? "gap-1" : "gap-4 shrink-0",
      className
    )}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousYear}
        disabled={currentYear <= minYear}
        className={cn(
          isMobile && "h-7 w-7 p-0"
        )}
      >
        <ChevronLeft className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
      </Button>
      
      <div className={cn(
        "font-bold text-gray-900 text-center shrink-0",
        isMobile ? "text-base min-w-[50px]" : "text-2xl min-w-[80px]"
      )}>
        {currentYear}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextYear}
        disabled={currentYear >= maxYear}
        className={cn(
          isMobile && "h-7 w-7 p-0"
        )}
      >
        <ChevronRight className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
      </Button>
    </div>
  );
};
