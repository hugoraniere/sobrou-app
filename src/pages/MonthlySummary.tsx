
import React, { useState } from 'react';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlySummaryTabs } from '@/components/monthly-summary/MonthlySummaryTabs';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const MonthlySummary = () => {
  const { isMobile } = useResponsive();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className="w-full max-w-full mx-auto min-h-screen px-2 sm:px-4 overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-full mt-6 mb-6 overflow-hidden">
        <div className={cn(
          "flex justify-between items-center w-full max-w-full",
          isMobile && "flex-col gap-3"
        )}>
          <div className="w-full max-w-full overflow-hidden">
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

      {/* Card da tabela responsivo */}
      <div className="w-full max-w-full bg-white rounded-lg border overflow-hidden">
        <MonthlySummaryTabs year={selectedYear} />
      </div>
    </div>
  );
};

export default MonthlySummary;
