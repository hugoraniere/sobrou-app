
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { EditableCell } from '../EditableCell';
import { EditableCategoryName } from '../EditableCategoryName';
import { CellPosition } from '@/hooks/useDragFill';
import { EditableCategoryData } from '@/hooks/useEditableMonthlySummary';

interface CategoryRowProps {
  category: EditableCategoryData;
  section: string;
  currentMonth: number;
  onCategoryNameChange: (newName: string) => void;
  onValueChange: (monthIndex: number, value: number) => void;
  selectedCell: CellPosition | null;
  onCellSelect: (position: CellPosition, value: number) => void;
  onDragStart: (position: CellPosition, value: number) => void;
  onDragMove: (position: CellPosition) => void;
  onDragEnd: () => void;
  isInFillRange: (position: CellPosition) => boolean;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  section,
  currentMonth,
  onCategoryNameChange,
  onValueChange,
  selectedCell,
  onCellSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  isInFillRange
}) => {
  const isCellSelected = (position: CellPosition): boolean => {
    return selectedCell?.categoryId === position.categoryId && 
           selectedCell?.monthIndex === position.monthIndex &&
           selectedCell?.section === position.section;
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="bg-white sticky left-0 z-10 pl-4 text-xs px-2 h-6">
        <EditableCategoryName
          value={category.displayName}
          onChange={onCategoryNameChange}
        />
      </TableCell>
      {category.values.map((value, monthIndex) => {
        const position: CellPosition = {
          categoryId: category.id,
          monthIndex,
          section
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
              onChange={(newValue) => onValueChange(monthIndex, newValue)}
              position={position}
              isSelected={isCellSelected(position)}
              isInFillRange={isInFillRange(position)}
              onCellSelect={onCellSelect}
              onDragStart={onDragStart}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
