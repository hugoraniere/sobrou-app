
import React from 'react';
import { TableRow } from "@/components/ui/table";
import { EditableCategoryData } from '@/hooks/useEditableMonthlySummary';
import { CellPosition } from '@/hooks/useDragFill';
import { cn } from '@/lib/utils';
import { TableSectionHeader } from './TableSectionHeader';
import { CategoryRow } from './CategoryRow';

interface TableSectionProps {
  title: string;
  section: string;
  categories: EditableCategoryData[];
  totals: number[];
  currentMonth: number;
  bgColor: string;
  textColor: string;
  selectedCell: CellPosition | null;
  onAddCategory: (section: keyof any, sectionTitle: string) => void;
  onCategoryNameChange: (section: keyof any, categoryId: string, newName: string) => void;
  onValueChange: (section: keyof any, categoryId: string, monthIndex: number, value: number) => void;
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
  isInFillRange,
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
      
      {categories.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          section={section}
          currentMonth={currentMonth}
          selectedCell={selectedCell}
          onCategoryNameChange={onCategoryNameChange}
          onValueChange={onValueChange}
          onCellSelect={onCellSelect}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          isInFillRange={isInFillRange}
        />
      ))}
    </>
  );
};
