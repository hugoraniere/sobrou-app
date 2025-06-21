import React, { useState } from 'react';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlySummaryTabs } from '@/components/monthly-summary/MonthlySummaryTabs';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const MonthlySummary = () => {
  const { isMobile } = useResponsive();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className="w-full max-w-screen overflow-x-hidden px-4 pb-10 box-border">
      {/* Header */}
      <div className={cn(
        "flex justify-between items-center mb-4",
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

      {/* Tabela com scroll horizontal DENTRO do card, não na página */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <div className="min-w-[768px] w-full">
          <MonthlySummaryTabs year={selectedYear} />
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;