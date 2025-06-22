
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PlanningTableProps {
  year: number;
  isDetailedView: boolean;
  onToggleView: (detailed: boolean) => void;
}

const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export const PlanningTable: React.FC<PlanningTableProps> = ({ year, isDetailedView, onToggleView }) => {
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
        updateCategoryValue(
          cell.section as keyof Omit<typeof data, 'year'>,
          cell.categoryId,
          cell.monthIndex,
          dragFill.dragStartValue
        );
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
      return "Defina seus valores planejados para cada categoria e mês.";
    }
    return "Defina um valor mensal planejado para cada categoria.";
  };

  const sections = [
    {
      title: 'RECEITAS',
      section: 'revenue' as const,
      sectionKey: 'REVENUE' as const,
      categories: data.revenue,
    },
    {
      title: 'GASTOS ESSENCIAIS',
      section: 'essentialExpenses' as const,
      sectionKey: 'ESSENTIAL' as const,
      categories: data.essentialExpenses,
    },
    {
      title: 'GASTOS NÃO ESSENCIAIS',
      section: 'nonEssentialExpenses' as const,
      sectionKey: 'NON_ESSENTIAL' as const,
      categories: data.nonEssentialExpenses,
    },
    {
      title: 'RESERVAS',
      section: 'reserves' as const,
      sectionKey: 'RESERVES' as const,
      categories: data.reserves,
    }
  ];

  return (
    <>
      <Card className="w-full max-w-full border-0 rounded-none">
        <CardHeader className="p-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base">
                Planejamento Financeiro {year}
              </CardTitle>
              <CardDescription className="text-xs">
                {getDescription()}
              </CardDescription>
            </div>
            <PlanningViewToggle
              isDetailedView={isDetailedView}
              onToggle={onToggleView}
            />
          </div>
        </CardHeader>
        <CardContent className="w-full max-w-full p-0">
          {isDetailedView ? (
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
                    {months.map((month, index) => (
                      <TableHead 
                        key={`planning-month-${index}`}
                        className={cn(
                          "text-xs px-1 text-center h-6",
                          isMobile ? "w-[50px]" : "w-[60px]",
                          getCurrentMonthColumnStyle(index === currentMonth)
                        )}
                      >
                        {month}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section) => (
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
          ) : (
            <SimplePlanningTable year={year} />
          )}
        </CardContent>
      </Card>

      <AddCategoryDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
        onAddCategory={handleCategorySubmit}
        sectionTitle={dialogState.sectionTitle}
      />
    </>
  );
};
