
import React, { useState } from 'react';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlyTable } from '@/components/monthly-summary/MonthlyTable';
import { useMonthlySummaryData } from '@/hooks/useMonthlySummaryData';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const MonthlySummary = () => {
  const { isMobile } = useResponsive();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { data, isLoading, error } = useMonthlySummaryData(selectedYear);

  const handleCategoryClick = (category: string, month: number) => {
    console.log(`Clicou na categoria ${category} do mês ${month + 1}`);
    // TODO: Implementar modal de detalhes/edição
  };

  if (error) {
    return (
      <div className={cn(
        "w-full overflow-hidden",
        isMobile ? "sm:px-8" : "container mx-auto max-w-screen-xl"
      )}>
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Erro ao carregar dados
          </h3>
          <p className="text-gray-600">
            Não foi possível carregar o resumo mensal. Tente novamente.
          </p>
        </Card>
      </div>
    );
  }

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
                  Visualize seu planejamento financeiro organizado por mês
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
          {isLoading ? (
            <Card className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </Card>
          ) : (
            <MonthlyTable
              data={data}
              onCategoryClick={handleCategoryClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
