
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableCell } from './EditableCell';
import { TableSection } from './table/TableSection';
import { SurplusRow } from './table/SurplusRow';
import { useEditablePlanning } from '@/hooks/useEditablePlanning';
import { useDragFill } from '@/hooks/useDragFill';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface PlanningTableProps {
  year: number;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const PlanningTable: React.FC<PlanningTableProps> = ({ year }) => {
  const { data, updateCategoryValue, totals, isLoading } = useEditablePlanning(year);
  const dragFill = useDragFill();
  const { isMobile } = useResponsive();

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando planejamento...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planejamento Financeiro {year}</CardTitle>
        <CardDescription>
          Defina seus valores planejados para cada categoria e mês
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
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
              <TableSection
                title="RECEITAS"
                categories={data.revenue}
                section="revenue"
                updateCategoryValue={updateCategoryValue}
                dragFill={dragFill}
                onDragFillEnd={handleDragFillEnd}
                className="bg-green-50"
              />
              
              <TableSection
                title="GASTOS ESSENCIAIS"
                categories={data.essentialExpenses}
                section="essentialExpenses"
                updateCategoryValue={updateCategoryValue}
                dragFill={dragFill}
                onDragFillEnd={handleDragFillEnd}
                className="bg-red-50"
              />
              
              <TableSection
                title="GASTOS NÃO ESSENCIAIS"
                categories={data.nonEssentialExpenses}
                section="nonEssentialExpenses"
                updateCategoryValue={updateCategoryValue}
                dragFill={dragFill}
                onDragFillEnd={handleDragFillEnd}
                className="bg-yellow-50"
              />
              
              <TableSection
                title="RESERVAS"
                categories={data.reserves}
                section="reserves"
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
      </CardContent>
    </Card>
  );
};
