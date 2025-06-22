
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { ComparativeTableHeader } from './comparative/ComparativeTableHeader';
import { ComparativeTableSection } from './comparative/ComparativeTableSection';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';

interface ComparativeTableProps {
  year: number;
  isDetailedView: boolean;
}

const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export const ComparativeTable: React.FC<ComparativeTableProps> = ({ year, isDetailedView }) => {
  const { 
    realData, 
    planningData, 
    simplePlanningData 
  } = useUnifiedMonthlySummary(year);
  const { isMobile } = useResponsive();
  
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
  };

  // Determinar qual dados de planejamento usar baseado no toggle
  const currentPlanningData = isDetailedView ? planningData : {
    year: simplePlanningData.year,
    revenue: simplePlanningData.revenue.map(cat => ({
      id: cat.id,
      displayName: cat.displayName,
      values: Array(12).fill(cat.monthlyValue)
    })),
    essentialExpenses: simplePlanningData.essentialExpenses.map(cat => ({
      id: cat.id,
      displayName: cat.displayName,
      values: Array(12).fill(cat.monthlyValue)
    })),
    nonEssentialExpenses: simplePlanningData.nonEssentialExpenses.map(cat => ({
      id: cat.id,
      displayName: cat.displayName,
      values: Array(12).fill(cat.monthlyValue)
    })),
    reserves: simplePlanningData.reserves.map(cat => ({
      id: cat.id,
      displayName: cat.displayName,
      values: Array(12).fill(cat.monthlyValue)
    }))
  };

  const sections = [
    {
      title: 'RECEITAS',
      sectionKey: 'REVENUE' as const,
      realCategories: realData.revenue,
      planningCategories: currentPlanningData.revenue,
    },
    {
      title: 'GASTOS ESSENCIAIS',
      sectionKey: 'ESSENTIAL' as const,
      realCategories: realData.essentialExpenses,
      planningCategories: currentPlanningData.essentialExpenses,
    },
    {
      title: 'GASTOS NÃO ESSENCIAIS',
      sectionKey: 'NON_ESSENTIAL' as const,
      realCategories: realData.nonEssentialExpenses,
      planningCategories: currentPlanningData.nonEssentialExpenses,
    },
    {
      title: 'RESERVAS',
      sectionKey: 'RESERVES' as const,
      realCategories: realData.reserves,
      planningCategories: currentPlanningData.reserves,
    }
  ];

  const getDescription = () => {
    const viewType = isDetailedView ? 'detalhado' : 'simples';
    return `Compare seus gastos reais com o planejamento ${viewType}.`;
  };

  return (
    <Card className="w-full max-w-full border-0 rounded-none">
      <CardHeader className="p-2">
        <CardTitle className="text-base">
          Comparativo: Real vs Planejado {year}
        </CardTitle>
        <CardDescription className="text-xs">
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full max-w-full p-0">
        <div className="w-full max-w-full overflow-x-auto">
          <Table className="w-full border-collapse" style={{ 
            minWidth: isMobile ? '100%' : '600px',
            maxWidth: '100%'
          }}>
            <TableHeader>
              <TableRow>
                <TableHead className={cn(
                  "text-xs px-1 h-6 sticky left-0 bg-white border-r-2 border-gray-300 z-30",
                  isMobile ? "w-[100px]" : "w-[120px]"
                )}>
                  Categoria
                </TableHead>
                <TableHead className="w-[60px] text-xs px-1 text-center h-6 bg-gray-100">
                  Plano
                </TableHead>
                {months.map((month, index) => (
                  <TableHead 
                    key={`comparative-month-${index}`}
                    className={cn(
                      "text-xs px-1 text-center h-6 cursor-pointer hover:bg-gray-50",
                      isMobile ? "w-[50px]" : "w-[60px]",
                      getCurrentMonthColumnStyle(index === currentMonth),
                      index === selectedMonth && "bg-blue-100 text-blue-800 font-semibold"
                    )}
                    onClick={() => handleMonthClick(index)}
                  >
                    {month}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <ComparativeTableSection
                  key={section.title}
                  title={section.title}
                  sectionKey={section.sectionKey}
                  realCategories={section.realCategories}
                  planningCategories={section.planningCategories}
                  currentMonth={currentMonth}
                  selectedMonth={selectedMonth}
                  months={months}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
