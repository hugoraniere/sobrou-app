
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useResponsive } from '@/hooks/useResponsive';
import { formatCurrency, cn } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { TABLE_COLUMN_WIDTHS, TABLE_CELL_STYLES, TABLE_Z_INDEX } from '@/constants/tableStyles';
import { ComparativeTooltip } from './ComparativeTooltip';

interface ComparativeTableProps {
  year: number;
  isDetailedView: boolean;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const ComparativeTable: React.FC<ComparativeTableProps> = ({ year, isDetailedView }) => {
  const { 
    realData, 
    planningData, 
    simplePlanningData,
    simplePlanningTotals 
  } = useUnifiedMonthlySummary(year);
  const { isMobile } = useResponsive();
  
  // Estado para o mês selecionado (inicializado com o mês atual)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const currentMonth = new Date().getMonth();

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

  const getVarianceColor = (real: number, planned: number) => {
    if (planned === 0) return 'text-gray-500';
    const variance = Math.abs(((real - planned) / planned) * 100);
    if (variance <= 5) return 'bg-green-50 text-green-700';
    if (variance <= 15) return 'bg-yellow-50 text-yellow-700';
    return 'bg-red-50 text-red-700';
  };

  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
  };

  const sections = [
    {
      title: 'RECEITAS',
      realCategories: realData.revenue,
      planningCategories: currentPlanningData.revenue,
      bgColor: 'bg-green-100'
    },
    {
      title: 'GASTOS ESSENCIAIS',
      realCategories: realData.essentialExpenses,
      planningCategories: currentPlanningData.essentialExpenses,
      bgColor: 'bg-red-100'
    },
    {
      title: 'GASTOS NÃO ESSENCIAIS',
      realCategories: realData.nonEssentialExpenses,
      planningCategories: currentPlanningData.nonEssentialExpenses,
      bgColor: 'bg-orange-100'
    },
    {
      title: 'RESERVAS',
      realCategories: realData.reserves,
      planningCategories: currentPlanningData.reserves,
      bgColor: 'bg-blue-100'
    }
  ];

  const getDescription = () => {
    const viewType = isDetailedView ? 'detalhado' : 'simples';
    return `Compare seus gastos reais com o planejamento ${viewType} por categoria. Clique nos meses para alterar a comparação.`;
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
            <TableHeader>
              <TableRow>
                <TableHead className={cn(
                  TABLE_COLUMN_WIDTHS.CATEGORY,
                  TABLE_CELL_STYLES.HEADER,
                  "sticky left-0 bg-white border-r",
                  TABLE_Z_INDEX.STICKY_CATEGORY
                )}>
                  Categoria
                </TableHead>
                <TableHead className={cn(
                  TABLE_COLUMN_WIDTHS.PLANNING_SPECIAL,
                  TABLE_CELL_STYLES.HEADER,
                  "text-center bg-gray-100 border-l-4 border-gray-400"
                )}>
                  Planejado ({months[selectedMonth]})
                </TableHead>
                {months.map((month, index) => (
                  <TableHead 
                    key={month} 
                    className={cn(
                      TABLE_COLUMN_WIDTHS.MONTH,
                      TABLE_CELL_STYLES.HEADER,
                      "text-center cursor-pointer hover:bg-gray-50 transition-colors",
                      index === selectedMonth && "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-500",
                      getCurrentMonthColumnStyle(index === currentMonth && index !== selectedMonth)
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
                <React.Fragment key={section.title}>
                  {/* Cabeçalho da seção */}
                  <TableRow className={section.bgColor}>
                    <TableCell 
                      colSpan={14} 
                      className={cn(
                        TABLE_CELL_STYLES.HEADER,
                        "font-bold sticky left-0",
                        TABLE_Z_INDEX.SECTION_HEADER
                      )}
                    >
                      {section.title}
                    </TableCell>
                  </TableRow>
                  
                  {/* Categorias da seção */}
                  {section.realCategories.map((realCategory) => {
                    const planningCategory = section.planningCategories.find(
                      p => p.id === realCategory.id
                    );
                    
                    return (
                      <TableRow key={realCategory.id} className="hover:bg-gray-50">
                        <TableCell className={cn(
                          TABLE_CELL_STYLES.CATEGORY_CELL,
                          "font-medium sticky left-0 bg-white border-r",
                          TABLE_Z_INDEX.SECTION_HEADER
                        )}>
                          {realCategory.displayName}
                        </TableCell>
                        
                        {/* Coluna de valor planejado para o mês selecionado */}
                        <TableCell className={cn(
                          TABLE_CELL_STYLES.DATA_CELL,
                          "text-center bg-gray-100 font-medium border-l-4 border-gray-400"
                        )}>
                          {formatCurrency(
                            planningCategory?.values[selectedMonth] || 0
                          )}
                        </TableCell>
                        
                        {/* Colunas dos meses */}
                        {months.map((month, monthIndex) => {
                          const realValue = realCategory.values[monthIndex] || 0;
                          const plannedValue = planningCategory?.values[monthIndex] || 0;
                          
                          return (
                            <TableCell 
                              key={monthIndex} 
                              className={cn(
                                TABLE_CELL_STYLES.DATA_CELL,
                                "text-center",
                                getVarianceColor(realValue, plannedValue),
                                monthIndex === selectedMonth && "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
                                getCurrentMonthColumnStyle(monthIndex === currentMonth && monthIndex !== selectedMonth)
                              )}
                            >
                              <ComparativeTooltip
                                realValue={realValue}
                                plannedValue={plannedValue}
                                categoryName={realCategory.displayName}
                                monthName={month}
                              >
                                <div className="cursor-help p-1 rounded">
                                  {formatCurrency(realValue)}
                                </div>
                              </ComparativeTooltip>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
