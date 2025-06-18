
import React, { useState } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { ComparativeTableHeader } from './comparative/ComparativeTableHeader';
import { ComparativeTableSection } from './comparative/ComparativeTableSection';

interface ComparativeTableProps {
  year: number;
  isDetailedView: boolean;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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
    return `Compare seus gastos reais com o planejamento ${viewType} por categoria.`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo: Real vs Planejado {year}</CardTitle>
        <CardDescription>
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className={cn("overflow-x-auto", isMobile && "max-w-[calc(100vw-2rem)]")}>
          <Table className="min-w-full">
            <ComparativeTableHeader
              months={months}
              currentMonth={currentMonth}
              selectedMonth={selectedMonth}
              onMonthClick={handleMonthClick}
            />
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
