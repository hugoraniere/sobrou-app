
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanningTableSection } from './table/PlanningTableSection';
import { SurplusRow } from './table/SurplusRow';
import { SimplePlanningTable } from './SimplePlanningTable';
import { PlanningViewToggle } from './PlanningViewToggle';
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useDragFill } from '@/hooks/useDragFill';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface PlanningTableProps {
  year: number;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const PlanningTable: React.FC<PlanningTableProps> = ({ year }) => {
  const { planningData: data, updatePlanningValue: updateCategoryValue, planningTotals: totals } = useUnifiedMonthlySummary(year);
  const dragFill = useDragFill();
  const { isMobile } = useResponsive();

  // Estado para controlar qual visualização está ativa
  const [isDetailedView, setIsDetailedView] = useState(() => {
    const stored = localStorage.getItem('planningViewMode');
    return stored ? JSON.parse(stored) : false; // Por padrão, visão simples
  });

  // Salvar preferência no localStorage
  useEffect(() => {
    localStorage.setItem('planningViewMode', JSON.stringify(isDetailedView));
  }, [isDetailedView]);

  const handleDragFillEnd = () => {
    const range = dragFill.endDrag();
    if (range) {
      const cells = dragFill.getCellsInRange(range);
      cells.forEach(cell => {
        if (cell.categoryId !== range.start.categoryId || cell.monthIndex === range.start.monthIndex) return;
        updateCategoryValue(
          cell.section as keyof Omit<typeof data, 'year'>,
          cell.categoryId,
          cell.monthIndex,
          dragFill.dragStartValue
        );
      });
    }
  };

  const getDescription = () => {
    if (isDetailedView) {
      return "Defina seus valores planejados para cada categoria e mês com controle detalhado";
    }
    return "Defina um valor mensal planejado para cada categoria. Os valores serão distribuídos automaticamente pelos 12 meses";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Planejamento Financeiro {year}</CardTitle>
            <CardDescription className="mt-2">
              {getDescription()}
            </CardDescription>
          </div>
          <PlanningViewToggle
            isDetailedView={isDetailedView}
            onToggle={setIsDetailedView}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isDetailedView ? (
          <div className={cn("overflow-x-auto", isMobile && "max-w-[calc(100vw-2rem)]")}>
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-20 bg-white border-r min-w-[140px] text-xs">
                    Categoria
                  </TableHead>
                  {months.map((month, index) => (
                    <TableHead key={month} className="text-center min-w-[80px] text-xs">
                      {month}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <PlanningTableSection
                  title="RECEITAS"
                  section="revenue"
                  categories={data.revenue}
                  updateCategoryValue={updateCategoryValue}
                  dragFill={dragFill}
                  onDragFillEnd={handleDragFillEnd}
                  className="bg-green-50"
                />
                
                <PlanningTableSection
                  title="GASTOS ESSENCIAIS"
                  section="essentialExpenses"
                  categories={data.essentialExpenses}
                  updateCategoryValue={updateCategoryValue}
                  dragFill={dragFill}
                  onDragFillEnd={handleDragFillEnd}
                  className="bg-red-50"
                />
                
                <PlanningTableSection
                  title="GASTOS NÃO ESSENCIAIS"
                  section="nonEssentialExpenses"
                  categories={data.nonEssentialExpenses}
                  updateCategoryValue={updateCategoryValue}
                  dragFill={dragFill}
                  onDragFillEnd={handleDragFillEnd}
                  className="bg-yellow-50"
                />
                
                <PlanningTableSection
                  title="RESERVAS"
                  section="reserves"
                  categories={data.reserves}
                  updateCategoryValue={updateCategoryValue}
                  dragFill={dragFill}
                  onDragFillEnd={handleDragFillEnd}
                  className="bg-blue-50"
                />
                
                <SurplusRow 
                  totals={totals}
                  currentMonth={new Date().getMonth()}
                />
              </TableBody>
            </Table>
          </div>
        ) : (
          <SimplePlanningTable year={year} />
        )}
      </CardContent>
    </Card>
  );
};
