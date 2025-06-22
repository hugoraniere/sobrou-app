
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash, GripVertical } from 'lucide-react';
import { EditableCategoryData } from '@/hooks/useEditableMonthlySummary';
import { CellPosition } from '@/hooks/useDragFill';
import { DeleteCategoryDialog } from '../DeleteCategoryDialog';
import { cn } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { EditableCategoryName } from '../EditableCategoryName';
import { EditableCell } from '../EditableCell';
import { 
  ConstrainedTableRow, 
  ConstrainedTableCell 
} from './ConstrainedTable';

interface CategoryRowProps {
  category: EditableCategoryData;
  section: string;
  sectionTitle: string;
  currentMonth: number;
  categoryIndex: number;
  selectedCell: CellPosition | null;
  onCategoryNameChange: (section: keyof any, categoryId: string, newName: string) => void;
  onValueChange: (section: keyof any, categoryId: string, monthIndex: number, value: number) => void;
  onCategoryRemove: (section: keyof any, categoryId: string) => void;
  onCellSelect: (position: CellPosition, value: number) => void;
  onDragStart: (position: CellPosition, value: number) => void;
  onDragMove: (position: CellPosition) => void;
  onDragEnd: () => void;
  isInFillRange: (position: CellPosition) => boolean;
  onCategoryDragStart: (index: number, section: string) => void;
  onCategoryDragOver: (index: number) => void;
  onCategoryDragEnd: () => void;
  isDraggedCategory: boolean;
  isDragOverCategory: boolean;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  section,
  sectionTitle,
  currentMonth,
  categoryIndex,
  selectedCell,
  onCategoryNameChange,
  onValueChange,
  onCategoryRemove,
  onCellSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  isInFillRange,
  onCategoryDragStart,
  onCategoryDragOver,
  onCategoryDragEnd,
  isDraggedCategory,
  isDragOverCategory,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRemoveClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmRemove = () => {
    onCategoryRemove(section as keyof any, category.id);
  };

  const handleCategoryDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    onCategoryDragStart(categoryIndex, section);
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onCategoryDragOver(categoryIndex);
  };

  const handleCategoryDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onCategoryDragEnd();
  };

  return (
    <>
      <ConstrainedTableRow 
        className={cn(
          "hover:bg-gray-50/50 group transition-all duration-200",
          isDraggedCategory && "opacity-50",
          isDragOverCategory && "border-t-2 border-blue-500"
        )}
        onDragOver={handleCategoryDragOver}
        onDrop={handleCategoryDrop}
      >
        <ConstrainedTableCell className={cn(
          "sticky left-0 bg-white border-r-2 border-gray-300 z-30"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div
                draggable
                onDragStart={handleCategoryDragStart}
                className="cursor-grab hover:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
                title="Arrastar para reordenar"
              >
                <GripVertical className="h-3 w-3 text-gray-400" />
              </div>
              <EditableCategoryName
                value={category.displayName}
                onChange={(newName) => onCategoryNameChange(section as keyof any, category.id, newName)}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Remover categoria"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </ConstrainedTableCell>
        
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
            <ConstrainedTableCell
              key={monthIndex}
              className={cn(
                "text-center relative",
                getCurrentMonthColumnStyle(monthIndex === currentMonth),
                isSelected && "ring-2 ring-blue-400",
                isInRange && "bg-blue-100"
              )}
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
            </ConstrainedTableCell>
          );
        })}
      </ConstrainedTableRow>

      <DeleteCategoryDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmRemove}
        categoryName={category.displayName}
        sectionTitle={sectionTitle}
      />
    </>
  );
};
