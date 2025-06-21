import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="w-full max-w-[330px] border-0 rounded-none">
        <CardHeader className="p-2">
          <CardTitle className="text-base">
            Gastos Mensais {year}
          </CardTitle>
          <CardDescription className="text-xs">
            Registre seus gastos reais e receitas.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full p-0">
          <div className="w-full max-w-[330px] overflow-x-auto">
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
