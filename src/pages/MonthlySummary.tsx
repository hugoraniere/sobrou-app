
import React, { useState } from 'react';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlyTable } from '@/components/monthly-summary/MonthlyTable';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const MonthlySummary = () => {
  const { isMobile } = useResponsive();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className={cn(
      "w-full overflow-hidden",
      isMobile ? "sm:px-8" : "container mx-auto max-w-screen-xl"
    )}>
      <div>
        {/* Header */}
        <div className="flex flex-col space-y-4 mt-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={cn(
                "font-bold text-gray-900",
                isMobile ? "text-2xl px-4" : "text-3xl"
              )}>
                Resumo Mensal
              </h1>
              {!isMobile && (
                <p className="text-gray-600 text-sm mt-1">
                  Planeje e edite seu orçamento financeiro mês a mês
                </p>
              )}
            </div>
            
            <div className={cn(isMobile && "px-4")}>
              <YearSelector
                currentYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cn("mt-4", isMobile && "px-4")}>
          <MonthlyTable year={selectedYear} />
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
