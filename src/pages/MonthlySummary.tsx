
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
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={cn(
              "font-bold text-gray-900",
              isMobile ? "text-2xl" : "text-3xl"
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
      </div>

      {/* Content */}
      <MonthlySummaryTabs year={selectedYear} />
    </div>
  );
};

export default MonthlySummary;
