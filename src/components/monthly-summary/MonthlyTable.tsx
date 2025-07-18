
import React, { useState } from 'react';
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCategoryDialog } from './AddCategoryDialog';
import { MonthlyTableContent } from './table/MonthlyTableContent';
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useDragFill } from '@/hooks/useDragFill';
import { createMonthlyTableHandlers } from './table/MonthlyTableHandlers';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface MonthlyTableProps {
  year: number;
}

export const MonthlyTable: React.FC<MonthlyTableProps> = ({ year }) => {
  const { isMobile } = useResponsive();
  
  const { 
    realData: data, 
    updateRealValue: updateCategoryValue, 
    updateRealName: updateCategoryName, 
    addRealCategory: addCategory, 
    removeRealCategory: removeCategory,
    reorderRealCategories: reorderCategories,
    realTotals: totals 
  } = useUnifiedMonthlySummary(year);
  
  const dragFill = useDragFill();
  
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

  const handlers = createMonthlyTableHandlers({
    updateCategoryValue,
    updateCategoryName,
    addCategory,
    removeCategory,
    dragFill
  });

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

  const handleCategoryReorder = (section: keyof Omit<typeof data, 'year'>, fromIndex: number, toIndex: number) => {
    reorderCategories(section, fromIndex, toIndex);
  };

  return (
    <>
      <div className="w-full">
        <CardHeader className={cn(isMobile ? "p-3 pb-2" : "p-6", "px-0")}>
          <CardTitle className={cn(isMobile ? "text-lg" : "text-xl")}>
            Gastos Mensais {year}
          </CardTitle>
          <CardDescription className={cn(isMobile ? "text-xs" : "text-sm")}>
            {isMobile 
              ? "Registre seus gastos reais e receitas. Use arrastar para preencher células."
              : "Registre seus gastos reais e receitas ao longo do ano. Use arrastar e soltar para preencher múltiplas células rapidamente. Arraste o ícone de 6 pontinhos para reordenar categorias."
            }
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <div className={cn(isMobile ? "min-w-[480px]" : "min-w-[800px]")}>
            <MonthlyTableContent
              data={data}
              totals={totals}
              currentMonth={currentMonth}
              selectedCell={dragFill.selectedCell}
              handlers={handlers}
              onAddCategory={handleAddCategory}
              onValueChange={updateCategoryValue}
              onCategoryReorder={handleCategoryReorder}
              isInFillRange={dragFill.isInFillRange}
            />
          </div>
        </div>
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
