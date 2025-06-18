
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCategoryDialog } from './AddCategoryDialog';
import { MonthlyTableContent } from './table/MonthlyTableContent';
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useDragFill } from '@/hooks/useDragFill';
import { createMonthlyTableHandlers } from './table/MonthlyTableHandlers';

interface MonthlyTableProps {
  year: number;
}

export const MonthlyTable: React.FC<MonthlyTableProps> = ({ year }) => {
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gastos Mensais {year}</CardTitle>
          <CardDescription>
            Registre seus gastos reais e receitas ao longo do ano. Use arrastar e soltar para preencher múltiplas células rapidamente. Arraste o ícone de 6 pontinhos para reordenar categorias.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
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
