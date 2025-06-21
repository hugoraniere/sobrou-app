
import React, { useState } from 'react';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlySummaryTabs } from '@/components/monthly-summary/MonthlySummaryTabs';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const MonthlySummary = () => {
  const { isMobile } = useResponsive();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className="w-full">
      {/* Header simplificado */}
      <div className={cn(
        "flex items-center justify-between mb-4",
        isMobile ? "flex-col gap-3" : "mb-6"
      )}>
        <div className={cn(isMobile && "w-full text-center")}>
          <h1 className={cn(
            "font-bold text-gray-900",
            isMobile ? "text-xl" : "text-3xl"
          )}>
            Resumo Mensal
          </h1>
          {!isMobile && (
            <p className="text-gray-600 text-sm mt-1">
              Visualize, planeje e compare seu orçamento financeiro
            </p>
          )}
        </div>
        
        <YearSelector
          currentYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Content */}
      <MonthlySummaryTabs year={selectedYear} />
    </div>
  );
};

export default MonthlySummary;
