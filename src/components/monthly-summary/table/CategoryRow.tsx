
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { EditableCategoryData } from '@/hooks/useEditableMonthlySummary';
import { CellPosition } from '@/hooks/useDragFill';
import { cn } from '@/lib/utils';
import { EditableCategoryName } from '../EditableCategoryName';
import { EditableCell } from '../EditableCell';

interface CategoryRowProps {
  category: EditableCategoryData;
  section: string;
  currentMonth: number;
  selectedCell: CellPosition | null;
  onCategoryNameChange: (section: keyof any, categoryId: string, newName: string) => void;
  onValueChange: (section: keyof any, categoryId: string, monthIndex: number, value: number) => void;
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
  selectedCell,
  onCategoryNameChange,
  onValueChange,
  onCellSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  isInFillRange,
}) => {
  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell className="sticky left-0 z-10 bg-white text-xs px-2 py-1 border-r">
        <EditableCategoryName
          value={category.displayName}
          onChange={(newName) => onCategoryNameChange(section as keyof any, category.id, newName)}
        />
      </TableCell>
      
      {category.values.map((value, monthIndex) => {
        const cellPosition: CellPosition = {
          section,
          categoryId: category.id,
          monthIndex
        };
        
        const isSelected = selectedCell && 
          selectedCell.section === section && 
          selectedCell.categoryId === category.id && 
          selectedCell.monthIndex === monthIndex;
        
        const isInRange = isInFillRange(cellPosition);
        
        return (
          <TableCell
            key={monthIndex}
            className={cn(
              "text-center text-xs px-1 py-1 relative",
              monthIndex === currentMonth && "bg-blue-50 border-r-2 border-blue-500",
              isSelected && "ring-2 ring-blue-400",
              isInRange && "bg-blue-100"
            )}
            data-cell-position={`${section}-${category.id}-${monthIndex}`}
          >
            <EditableCell
              value={value}
              onChange={(newValue) => onValueChange(section as keyof any, category.id, monthIndex, newValue)}
              position={cellPosition}
              isSelected={isSelected}
              isInFillRange={isInRange}
              onCellSelect={() => onCellSelect(cellPosition, value)}
              onDragStart={() => onDragStart(cellPosition, value)}
              onDragMove={() => onDragMove(cellPosition)}
              onDragEnd={onDragEnd}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
