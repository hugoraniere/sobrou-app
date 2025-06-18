
import React from 'react';
import { TableSectionHeader } from './TableSectionHeader';
import { CategoryRow } from './CategoryRow';
import { TableRow, TableCell } from "@/components/ui/table";
import { AddCategoryButton } from '../AddCategoryButton';
import { cn } from '@/lib/utils';
import { CellPosition } from '@/hooks/useDragFill';
import { EditableCategoryData } from '@/hooks/useEditableMonthlySummary';

interface TableSectionProps {
  title: string;
  section: string;
  categories: EditableCategoryData[];
  totals: number[];
  currentMonth: number;
  bgColor: string;
  textColor: string;
  selectedCell: CellPosition | null;
  onAddCategory: (section: string, title: string) => void;
  onCategoryNameChange: (section: string, categoryId: string, newName: string) => void;
  onValueChange: (section: string, categoryId: string, monthIndex: number, value: number) => void;
  onCellSelect: (position: CellPosition, value: number) => void;
  onDragStart: (position: CellPosition, value: number) => void;
  onDragMove: (position: CellPosition) => void;
  onDragEnd: () => void;
  isInFillRange: (position: CellPosition) => boolean;
}

export const TableSection: React.FC<TableSectionProps> = ({
  title,
  section,
  categories,
  totals,
  currentMonth,
  bgColor,
  textColor,
  selectedCell,
  onAddCategory,
  onCategoryNameChange,
  onValueChange,
  onCellSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  isInFillRange
}) => {
  return (
    <>
      <TableSectionHeader
        title={title}
        totals={totals}
        currentMonth={currentMonth}
        bgColor={bgColor}
        textColor={textColor}
      />
      
      {categories.map(category => (
        <CategoryRow
          key={category.id}
          category={category}
          section={section}
          currentMonth={currentMonth}
          onCategoryNameChange={(newName) => onCategoryNameChange(section, category.id, newName)}
          onValueChange={(monthIndex, value) => onValueChange(section, category.id, monthIndex, value)}
          selectedCell={selectedCell}
          onCellSelect={onCellSelect}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          isInFillRange={isInFillRange}
        />
      ))}
      
      <TableRow>
        <TableCell className="bg-white sticky left-0 z-10 pl-4 px-2 h-6">
          <AddCategoryButton onClick={() => onAddCategory(section, title)} />
        </TableCell>
        {Array(12).fill(null).map((_, index) => (
          <TableCell 
            key={index}
            className={cn("h-6", index === currentMonth && "bg-blue-50")}
          ></TableCell>
        ))}
      </TableRow>
    </>
  );
};
