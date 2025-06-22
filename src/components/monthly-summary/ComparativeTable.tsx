
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { ComparativeTableSection } from './comparative/ComparativeTableSection';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { 
  ConstrainedTable, 
  ConstrainedTableHeader, 
  ConstrainedTableBody, 
  ConstrainedTableRow, 
  ConstrainedTableHead 
} from './table/ConstrainedTable';

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

  // Definir larguras das colunas responsivamente
  const getCategoryColumnWidth = () => isMobile ? "100px" : "120px";
  const getPlanColumnWidth = () => isMobile ? "50px" : "60px";
  const getMonthColumnWidth = () => isMobile ? "45px" : "50px";

  return (
    <Card className="w-full max-w-full border-0 rounded-none overflow-hidden">
      <CardHeader className="p-2">
        <CardTitle className="text-base">
          Comparativo: Real vs Planejado {year}
        </CardTitle>
        <CardDescription className="text-xs">
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full max-w-full p-0 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <ConstrainedTable 
            style={{ 
              minWidth: isMobile ? "730px" : "860px"
            }}
          >
            <ConstrainedTableHeader>
              <ConstrainedTableRow>
                <ConstrainedTableHead 
                  className="sticky left-0 bg-white border-r-2 border-gray-300 z-30 font-semibold"
                  style={{ width: getCategoryColumnWidth() }}
                >
                  Categoria
                </ConstrainedTableHead>
                <ConstrainedTableHead 
                  className="text-center bg-gray-100 font-semibold"
                  style={{ width: getPlanColumnWidth() }}
                >
                  Plano
                </ConstrainedTableHead>
                {months.map((month, index) => (
                  <ConstrainedTableHead 
                    key={`comparative-month-${index}`}
                    className={cn(
                      "text-center cursor-pointer hover:bg-gray-50 font-semibold",
                      getCurrentMonthColumnStyle(index === currentMonth),
                      index === selectedMonth && "bg-blue-100 text-blue-800"
                    )}
                    style={{ width: getMonthColumnWidth() }}
                    onClick={() => handleMonthClick(index)}
                  >
                    {month}
                  </ConstrainedTableHead>
                ))}
              </ConstrainedTableRow>
            </ConstrainedTableHeader>
            <ConstrainedTableBody>
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
            </ConstrainedTableBody>
          </ConstrainedTable>
        </div>
      </CardContent>
    </Card>
  );
};
