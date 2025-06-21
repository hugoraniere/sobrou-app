import React, { useState } from 'react';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlySummaryTabs } from '@/components/monthly-summary/MonthlySummaryTabs';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const MonthlySummary = () => {
  const { isMobile } = useResponsive();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const content = (
    <>
      {/* Header */}
      <div
        className={cn(
          "flex justify-between mb-4",
          isMobile ? "flex-col gap-3 items-center text-center" : "items-center mb-6"
        )}
      >
        <div className={cn(isMobile ? "w-full" : "")}>
          <h1
            className={cn(
              "font-bold text-gray-900",
              isMobile ? "text-xl" : "text-3xl"
            )}
          >
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

      {/* Content */}
      <MonthlySummaryTabs year={selectedYear} />
    </>
  );

  // Mobile: sem scroll horizontal + padding lateral único de 16px
  if (isMobile) {
    return (
      <main className="w-full max-w-screen w-screen overflow-x-hidden px-4 pt-6 pb-10">
        {content}
      </main>
    );
  }

  // Desktop padrão
  return (
    <main className="w-full px-6 py-8">
      {content}
    </main>
  );
};

export default MonthlySummary;