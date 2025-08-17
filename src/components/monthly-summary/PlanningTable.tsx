
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanningTableSection } from './table/PlanningTableSection';
import { SurplusRow } from './table/SurplusRow';
import { SimplePlanningTable } from './SimplePlanningTable';
import { PlanningViewToggle } from './PlanningViewToggle';
import { AddCategoryDialog } from './AddCategoryDialog';
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useDragFill } from '@/hooks/useDragFill';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { 
  getCategoryColumnWidth, 
  getMonthColumnWidth, 
  getTableCellClass, 
  TABLE_Z_INDEX 
} from '@/constants/tableStyles';

interface PlanningTableProps {
  year: number;
  isDetailedView: boolean;
  onToggleView: (detailed: boolean) => void;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const PlanningTable: React.FC<PlanningTableProps> = ({
  year,
  isDetailedView,
  onToggleView
}) => {
  const {
    planningData: data,
    updatePlanningValue: updateCategoryValue,
    planningTotals: totals,
    addRealCategory: addCategory
  } = useUnifiedMonthlySummary(year);

  const dragFill = useDragFill();
  const { isMobile } = useResponsive();

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    section: keyof Omit<typeof data, 'year'> | null;
    sectionTitle: string;
  }>({
    open: false,
    section: null,
    sectionTitle: ''
  });

  const currentMonth = new Date().getMonth();

  const handleDragFillEnd = () => {
    const range = dragFill.endDrag();
    if (range) {
      const cells = dragFill.getCellsInRange(range);
      cells.forEach(cell => {
        if (cell.categoryId !== range.start.categoryId || cell.monthIndex === range.start.monthIndex) return;
        updateCategoryValue(cell.section as keyof Omit<typeof data, 'year'>, cell.categoryId, cell.monthIndex, dragFill.dragStartValue);
      });
    }
  };

  const handleAddCategory = (section: keyof Omit<typeof data, 'year'>, sectionTitle: string) => {
    setDialogState({
      open: true,
      section,
      sectionTitle
    });
  };

  const handleCategorySubmit = (name: string) => {
    if (dialogState.section) {
      addCategory(dialogState.section, name);
    }
  };

  const getDescription = () => {
    if (isDetailedView) {
      return "Defina seus valores planejados para cada categoria e mês com controle detalhado";
    }
    return "Defina um valor mensal planejado para cada categoria. Os valores serão distribuídos automaticamente pelos 12 meses";
  };

  const sections = [
    {
      title: 'RECEITAS',
      section: 'revenue' as const,
      sectionKey: 'REVENUE' as const,
      categories: data.revenue
    },
    {
      title: 'GASTOS ESSENCIAIS',
      section: 'essentialExpenses' as const,
      sectionKey: 'ESSENTIAL' as const,
      categories: data.essentialExpenses
    },
    {
      title: 'GASTOS NÃO ESSENCIAIS',
      section: 'nonEssentialExpenses' as const,
      sectionKey: 'NON_ESSENTIAL' as const,
      categories: data.nonEssentialExpenses
    },
    {
      title: 'RESERVAS',
      section: 'reserves' as const,
      sectionKey: 'RESERVES' as const,
      categories: data.reserves
    }
  ];

  return (
    <>
      <div className="w-full">
        <CardHeader className="px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Planejamento Financeiro {year}</CardTitle>
              <CardDescription className="mt-2">
                {getDescription()}
              </CardDescription>
            </div>
            <PlanningViewToggle isDetailedView={isDetailedView} onToggle={onToggleView} />
          </div>
        </CardHeader>
        
        {isDetailedView ? (
          <div className="overflow-x-auto">
            <div className={cn("min-w-[800px]", isMobile && "min-w-[400px]")}>
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn(
                      getCategoryColumnWidth(isMobile),
                      getTableCellClass('HEADER'),
                      "sticky left-0 bg-white border-r",
                      TABLE_Z_INDEX.STICKY_CATEGORY
                    )}>
                      Categoria
                    </TableHead>
                    {months.map((month, index) => (
                      <TableHead 
                        key={month} 
                        className={cn(
                          getMonthColumnWidth(isMobile),
                          getTableCellClass('HEADER'),
                          "text-center",
                          getCurrentMonthColumnStyle(index === currentMonth)
                        )}
                      >
                        {month}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map(section => (
                    <PlanningTableSection
                      key={section.title}
                      title={section.title}
                      section={section.section}
                      sectionKey={section.sectionKey}
                      categories={section.categories}
                      updateCategoryValue={updateCategoryValue}
                      onAddCategory={() => handleAddCategory(section.section, section.title)}
                      dragFill={dragFill}
                      onDragFillEnd={handleDragFillEnd}
                    />
                  ))}
                  
                  <SurplusRow 
                    totals={totals}
                    currentMonth={currentMonth}
                  />
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <SimplePlanningTable year={year} />
        )}
      </div>

      <AddCategoryDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
        onAddCategory={handleCategorySubmit}
        sectionTitle={dialogState.sectionTitle}
      />
    </>
  );
};
