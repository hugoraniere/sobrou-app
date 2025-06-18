
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MONTHS_SHORT } from '@/types/monthly-summary';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { EditableCell } from './EditableCell';
import { EditableCategoryName } from './EditableCategoryName';
import { AddCategoryButton } from './AddCategoryButton';
import { AddCategoryDialog } from './AddCategoryDialog';
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

  const isCellSelected = (position: CellPosition): boolean => {
    return selectedCell?.categoryId === position.categoryId && 
           selectedCell?.monthIndex === position.monthIndex &&
           selectedCell?.section === position.section;
  };

  const isCellInFillRange = (position: CellPosition): boolean => {
    return isInFillRange(position);
  };

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
                {/* RECEITAS */}
                <TableRow className="bg-green-50">
                  <TableCell className="font-bold bg-green-100 sticky left-0 z-10 text-xs px-2 h-6">
                    RECEITAS (R)
                  </TableCell>
                  {totals.map((total, index) => (
                    <TableCell 
                      key={index} 
                      className={cn(
                        "text-center font-semibold text-green-700 text-xs px-1 h-6",
                        index === currentMonth && "bg-blue-50"
                      )}
                    >
                      {formatCurrency(total.revenue)}
                    </TableCell>
                  ))}
                </TableRow>
                
                {data.revenue.map(category => (
                  <TableRow key={category.id} className="hover:bg-gray-50">
                    <TableCell className="bg-white sticky left-0 z-10 pl-4 text-xs px-2 h-6">
                      <EditableCategoryName
                        value={category.displayName}
                        onChange={(newName) => handleCategoryNameChange('revenue', category.id, newName)}
                      />
                    </TableCell>
                    {category.values.map((value, monthIndex) => {
                      const position: CellPosition = {
                        categoryId: category.id,
                        monthIndex,
                        section: 'revenue'
                      };
                      
                      return (
                        <TableCell 
                          key={monthIndex} 
                          className={cn(
                            "p-0.5 h-6",
                            monthIndex === currentMonth && "bg-blue-50"
                          )}
                        >
                          <EditableCell
                            value={value}
                            onChange={(newValue) => updateCategoryValue('revenue', category.id, monthIndex, newValue)}
                            position={position}
                            isSelected={isCellSelected(position)}
                            isInFillRange={isCellInFillRange(position)}
                            onCellSelect={handleCellSelect}
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                
                <TableRow>
                  <TableCell className="bg-white sticky left-0 z-10 pl-4 px-2 h-6">
                    <AddCategoryButton onClick={() => handleAddCategory('revenue', 'Receitas')} />
                  </TableCell>
                  {Array(12).fill(null).map((_, index) => (
                    <TableCell 
                      key={index}
                      className={cn("h-6", index === currentMonth && "bg-blue-50")}
                    ></TableCell>
                  ))}
                </TableRow>

                {/* DESPESAS ESSENCIAIS */}
                <TableRow className="bg-red-50">
                  <TableCell className="font-bold bg-red-100 sticky left-0 z-10 text-xs px-2 h-6">
                    DESPESAS ESSENCIAIS (D1)
                  </TableCell>
                  {totals.map((total, index) => (
                    <TableCell 
                      key={index} 
                      className={cn(
                        "text-center font-semibold text-red-700 text-xs px-1 h-6",
                        index === currentMonth && "bg-blue-50"
                      )}
                    >
                      {formatCurrency(total.essential)}
                    </TableCell>
                  ))}
                </TableRow>
                
                {data.essentialExpenses.map(category => (
                  <TableRow key={category.id} className="hover:bg-gray-50">
                    <TableCell className="bg-white sticky left-0 z-10 pl-4 text-xs px-2 h-6">
                      <EditableCategoryName
                        value={category.displayName}
                        onChange={(newName) => handleCategoryNameChange('essentialExpenses', category.id, newName)}
                      />
                    </TableCell>
                    {category.values.map((value, monthIndex) => {
                      const position: CellPosition = {
                        categoryId: category.id,
                        monthIndex,
                        section: 'essentialExpenses'
                      };
                      
                      return (
                        <TableCell 
                          key={monthIndex} 
                          className={cn(
                            "p-0.5 h-6",
                            monthIndex === currentMonth && "bg-blue-50"
                          )}
                        >
                          <EditableCell
                            value={value}
                            onChange={(newValue) => updateCategoryValue('essentialExpenses', category.id, monthIndex, newValue)}
                            position={position}
                            isSelected={isCellSelected(position)}
                            isInFillRange={isCellInFillRange(position)}
                            onCellSelect={handleCellSelect}
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                
                <TableRow>
                  <TableCell className="bg-white sticky left-0 z-10 pl-4 px-2 h-6">
                    <AddCategoryButton onClick={() => handleAddCategory('essentialExpenses', 'Despesas Essenciais')} />
                  </TableCell>
                  {Array(12).fill(null).map((_, index) => (
                    <TableCell 
                      key={index}
                      className={cn("h-6", index === currentMonth && "bg-blue-50")}
                    ></TableCell>
                  ))}
                </TableRow>

                {/* DESPESAS NÃO ESSENCIAIS */}
                <TableRow className="bg-orange-50">
                  <TableCell className="font-bold bg-orange-100 sticky left-0 z-10 text-xs px-2 h-6">
                    DESPESAS NÃO ESSENCIAIS (D2)
                  </TableCell>
                  {totals.map((total, index) => (
                    <TableCell 
                      key={index} 
                      className={cn(
                        "text-center font-semibold text-orange-700 text-xs px-1 h-6",
                        index === currentMonth && "bg-blue-50"
                      )}
                    >
                      {formatCurrency(total.nonEssential)}
                    </TableCell>
                  ))}
                </TableRow>
                
                {data.nonEssentialExpenses.map(category => (
                  <TableRow key={category.id} className="hover:bg-gray-50">
                    <TableCell className="bg-white sticky left-0 z-10 pl-4 text-xs px-2 h-6">
                      <EditableCategoryName
                        value={category.displayName}
                        onChange={(newName) => handleCategoryNameChange('nonEssentialExpenses', category.id, newName)}
                      />
                    </TableCell>
                    {category.values.map((value, monthIndex) => {
                      const position: CellPosition = {
                        categoryId: category.id,
                        monthIndex,
                        section: 'nonEssentialExpenses'
                      };
                      
                      return (
                        <TableCell 
                          key={monthIndex} 
                          className={cn(
                            "p-0.5 h-6",
                            monthIndex === currentMonth && "bg-blue-50"
                          )}
                        >
                          <EditableCell
                            value={value}
                            onChange={(newValue) => updateCategoryValue('nonEssentialExpenses', category.id, monthIndex, newValue)}
                            position={position}
                            isSelected={isCellSelected(position)}
                            isInFillRange={isCellInFillRange(position)}
                            onCellSelect={handleCellSelect}
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                
                <TableRow>
                  <TableCell className="bg-white sticky left-0 z-10 pl-4 px-2 h-6">
                    <AddCategoryButton onClick={() => handleAddCategory('nonEssentialExpenses', 'Despesas Não Essenciais')} />
                  </TableCell>
                  {Array(12).fill(null).map((_, index) => (
                    <TableCell 
                      key={index}
                      className={cn("h-6", index === currentMonth && "bg-blue-50")}
                    ></TableCell>
                  ))}
                </TableRow>

                {/* RESERVAS MENSAIS */}
                <TableRow className="bg-blue-50">
                  <TableCell className="font-bold bg-blue-100 sticky left-0 z-10 text-xs px-2 h-6">
                    RESERVAS MENSAIS
                  </TableCell>
                  {totals.map((total, index) => (
                    <TableCell 
                      key={index} 
                      className={cn(
                        "text-center font-semibold text-blue-700 text-xs px-1 h-6",
                        index === currentMonth && "bg-blue-50"
                      )}
                    >
                      {formatCurrency(total.reserves)}
                    </TableCell>
                  ))}
                </TableRow>
                
                {data.reserves.map(category => (
                  <TableRow key={category.id} className="hover:bg-gray-50">
                    <TableCell className="bg-white sticky left-0 z-10 pl-4 text-xs px-2 h-6">
                      <EditableCategoryName
                        value={category.displayName}
                        onChange={(newName) => handleCategoryNameChange('reserves', category.id, newName)}
                      />
                    </TableCell>
                    {category.values.map((value, monthIndex) => {
                      const position: CellPosition = {
                        categoryId: category.id,
                        monthIndex,
                        section: 'reserves'
                      };
                      
                      return (
                        <TableCell 
                          key={monthIndex} 
                          className={cn(
                            "p-0.5 h-6",
                            monthIndex === currentMonth && "bg-blue-50"
                          )}
                        >
                          <EditableCell
                            value={value}
                            onChange={(newValue) => updateCategoryValue('reserves', category.id, monthIndex, newValue)}
                            position={position}
                            isSelected={isCellSelected(position)}
                            isInFillRange={isCellInFillRange(position)}
                            onCellSelect={handleCellSelect}
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                
                <TableRow>
                  <TableCell className="bg-white sticky left-0 z-10 pl-4 px-2 h-6">
                    <AddCategoryButton onClick={() => handleAddCategory('reserves', 'Reservas Mensais')} />
                  </TableCell>
                  {Array(12).fill(null).map((_, index) => (
                    <TableCell 
                      key={index}
                      className={cn("h-6", index === currentMonth && "bg-blue-50")}
                    ></TableCell>
                  ))}
                </TableRow>

                {/* SOBRA MENSAL */}
                <TableRow className="bg-gray-100 border-t-2">
                  <TableCell className="font-bold text-xs bg-gray-200 sticky left-0 z-10 px-2 h-7">
                    SOBRA MENSAL
                  </TableCell>
                  {totals.map((total, index) => (
                    <TableCell 
                      key={index} 
                      className={cn(
                        "text-center font-bold text-xs px-1 h-7",
                        total.surplus >= 0 ? "text-green-600" : "text-red-600",
                        index === currentMonth && "bg-blue-50"
                      )}
                    >
                      {formatCurrency(total.surplus)}
                    </TableCell>
                  ))}
                </TableRow>
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
