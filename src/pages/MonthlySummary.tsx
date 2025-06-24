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

      {/* Tabs container */}
      <div className="w-full mb-4">
        {/* Certifique-se de que seu componente MonthlySummaryTabs distribui os tabs com `w-full flex justify-between` ou similar */}
        <MonthlySummaryTabs year={selectedYear} />
      </div>

      {/* Card com tabela scrollável internamente */}
      <div className="bg-white rounded-lg border overflow-x-auto p-4">
        <div className="min-w-[768px]">
          {/* Aqui dentro a tabela real, com scroll horizontal interno */}
          {/* Ex: MonthlySummaryTable ou conteúdo interno do tab selecionado */}
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;