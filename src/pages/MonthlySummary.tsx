
import React, { useState } from 'react';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlySummaryTabs } from '@/components/monthly-summary/MonthlySummaryTabs';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const MonthlySummary = () => {
  const { isMobile } = useResponsive();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className={cn(
      "w-full",
      isMobile ? "px-4 pb-10" : "container mx-auto max-w-screen-xl pb-10"
    )}>
      {/* Header */}
      <div className="mt-6 mb-6">
        <div className={cn(
          "flex justify-between items-center",
          isMobile && "flex-col gap-3 text-center"
        )}>
          <div className="w-full">
            <h1 className={cn("font-bold text-gray-900", isMobile ? "text-xl" : "text-3xl")}>
              Resumo Mensal
            </h1>
            {!isMobile && (
              <p className="text-gray-600 text-sm mt-1">
                Visualize, planeje e compare seu orçamento financeiro
              </p>
            )}
          </div>
          <YearSelector currentYear={selectedYear} onYearChange={setSelectedYear} />
        </div>
      </div>

      {/* Tabs com tabela integrada */}
      <MonthlySummaryTabs year={selectedYear} />
    </div>
  );
};

export default MonthlySummary;
