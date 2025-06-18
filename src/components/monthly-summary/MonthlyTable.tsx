
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MONTHS_SHORT } from '@/types/monthly-summary';
import { cn } from '@/lib/utils';
import { AddCategoryDialog } from './AddCategoryDialog';
import { TableSection } from './table/TableSection';
import { SurplusRow } from './table/SurplusRow';
import { useEditableMonthlySummary } from '@/hooks/useEditableMonthlySummary';
import { useDragFill, CellPosition } from '@/hooks/useDragFill';

interface MonthlyTableProps {
  year: number;
}

export const MonthlyTable: React.FC<MonthlyTableProps> = ({ year }) => {
  const { data, updateCategoryValue, updateCategoryName, addCategory, totals } = useEditableMonthlySummary(year);
  const {
    selectedCell,
    fillRange,
    isDragging,
    dragStartValue,
    selectCell,
    startDrag,
    updateDragRange,
    endDrag,
    clearSelection,
    getCellsInRange,
    isInFillRange
  } = useDragFill();
  
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

  const handleCategoryNameChange = (
    section: keyof Omit<typeof data, 'year'>,
    categoryId: string,
    newName: string
  ) => {
    updateCategoryName(section, categoryId, newName);
  };

  const handleCellSelect = (position: CellPosition, value: number) => {
    selectCell(position, value);
  };

  const handleDragStart = (position: CellPosition, value: number) => {
    startDrag(position, value);
  };

  const handleDragMove = (position: CellPosition) => {
    updateDragRange(position);
  };

  const handleDragEnd = () => {
    const range = endDrag();
    if (range) {
      const cellsToFill = getCellsInRange(range);
      // Aplicar o valor arrastado para todas as células no range
      cellsToFill.forEach(cell => {
        updateCategoryValue(
          cell.section as keyof Omit<typeof data, 'year'>,
          cell.categoryId,
          cell.monthIndex,
          dragStartValue
        );
      });
    }
  };

  const handleTableClick = (e: React.MouseEvent) => {
    // Se clicou fora de uma célula, limpar seleção
    const target = e.target as HTMLElement;
    if (!target.closest('[data-cell-position]')) {
      clearSelection();
    }
  };

  // Configurações das seções
  const sections = [
    {
      title: 'RECEITAS (R)',
      section: 'revenue',
      categories: data.revenue,
      totals: totals.map(t => t.revenue),
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'DESPESAS ESSENCIAIS (D1)',
      section: 'essentialExpenses',
      categories: data.essentialExpenses,
      totals: totals.map(t => t.essential),
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'DESPESAS NÃO ESSENCIAIS (D2)',
      section: 'nonEssentialExpenses',
      categories: data.nonEssentialExpenses,
      totals: totals.map(t => t.nonEssential),
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'RESERVAS MENSAIS',
      section: 'reserves',
      categories: data.reserves,
      totals: totals.map(t => t.reserves),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    }
  ];

  return (
    <>
      <Card className="w-full">
        <ScrollArea className="w-full">
          <div className="min-w-[1000px]" onClick={handleTableClick}>
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="w-40 font-bold bg-gray-50 sticky left-0 z-20 text-xs px-2 h-6">
                    Categoria
                  </TableHead>
                  {MONTHS_SHORT.map((month, index) => (
                    <TableHead 
                      key={index} 
                      className={cn(
                        "text-center min-w-[70px] font-bold text-xs px-1 h-6",
                        index === currentMonth && "bg-blue-50"
                      )}
                    >
                      {month}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map(sectionConfig => (
                  <TableSection
                    key={sectionConfig.section}
                    title={sectionConfig.title}
                    section={sectionConfig.section}
                    categories={sectionConfig.categories}
                    totals={sectionConfig.totals}
                    currentMonth={currentMonth}
                    bgColor={sectionConfig.bgColor}
                    textColor={sectionConfig.textColor}
                    selectedCell={selectedCell}
                    onAddCategory={handleAddCategory}
                    onCategoryNameChange={handleCategoryNameChange}
                    onValueChange={updateCategoryValue}
                    onCellSelect={handleCellSelect}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    isInFillRange={isInFillRange}
                  />
                ))}

                <SurplusRow totals={totals} currentMonth={currentMonth} />
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
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
