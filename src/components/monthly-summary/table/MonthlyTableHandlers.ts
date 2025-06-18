
import { EditableMonthlySummary } from '@/hooks/useEditableMonthlySummary';
import { CellPosition } from '@/hooks/useDragFill';

interface MonthlyTableHandlersProps {
  updateCategoryValue: (
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    categoryId: string,
    monthIndex: number,
    value: number
  ) => void;
  updateCategoryName: (
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    categoryId: string,
    newName: string
  ) => void;
  addCategory: (
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    name: string
  ) => void;
  removeCategory: (
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    categoryId: string
  ) => void;
  dragFill: any;
}

export const createMonthlyTableHandlers = ({
  updateCategoryValue,
  updateCategoryName,
  addCategory,
  removeCategory,
  dragFill
}: MonthlyTableHandlersProps) => {
  const handleCategoryNameChange = (
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    categoryId: string,
    newName: string
  ) => {
    updateCategoryName(section, categoryId, newName);
  };

  const handleCategoryRemove = (
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    categoryId: string
  ) => {
    removeCategory(section, categoryId);
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
      const cells = dragFill.getCellsInRange(range);
      console.log('Filling cells:', cells, 'with value:', dragFill.dragStartValue);
      
      // Preencher todas as células do range, incluindo a inicial
      cells.forEach((cell: CellPosition) => {
        updateCategoryValue(
          cell.section as keyof Omit<EditableMonthlySummary, 'year'>,
          cell.categoryId,
          cell.monthIndex,
          dragFill.dragStartValue
        );
      });
    }
  };

  return {
    handleCategoryNameChange,
    handleCategoryRemove,
    handleCellSelect,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
};
