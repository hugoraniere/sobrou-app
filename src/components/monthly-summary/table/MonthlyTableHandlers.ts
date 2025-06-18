
import { CellPosition } from '@/hooks/useDragFill';

export interface MonthlyTableHandlersProps {
  updateCategoryValue: (section: keyof any, categoryId: string, monthIndex: number, value: number) => void;
  updateCategoryName: (section: keyof any, categoryId: string, newName: string) => void;
  addCategory: (section: keyof any, name: string) => void;
  dragFill: any;
}

export const createMonthlyTableHandlers = ({
  updateCategoryValue,
  updateCategoryName,
  addCategory,
  dragFill
}: MonthlyTableHandlersProps) => {
  const handleCategoryNameChange = (
    section: keyof any,
    categoryId: string,
    newName: string
  ) => {
    updateCategoryName(section, categoryId, newName);
  };

  const handleCellSelect = (position: CellPosition, value: number) => {
    dragFill.selectCell(position, value);
  };

  const handleDragStart = (position: CellPosition, value: number) => {
    dragFill.startDrag(position, value);
  };

  const handleDragMove = (position: CellPosition) => {
    dragFill.updateDragRange(position);
  };

  const handleDragEnd = () => {
    const range = dragFill.endDrag();
    if (range) {
      const cellsToFill = dragFill.getCellsInRange(range);
      console.log('Applying drag fill with value:', dragFill.dragStartValue, 'to cells:', cellsToFill);
      
      cellsToFill.forEach((cell: CellPosition) => {
        if (cell.categoryId !== range.start.categoryId || cell.monthIndex === range.start.monthIndex) return;
        
        updateCategoryValue(
          cell.section as keyof any,
          cell.categoryId,
          cell.monthIndex,
          dragFill.dragStartValue
        );
      });
    }
  };

  const handleTableClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-cell-position]')) {
      dragFill.clearSelection();
    }
  };

  return {
    handleCategoryNameChange,
    handleCellSelect,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleTableClick
  };
};
