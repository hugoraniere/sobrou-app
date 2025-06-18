
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { EditableCategoryData } from '@/hooks/useEditableMonthlySummary';
import { CellPosition } from '@/hooks/useDragFill';
import { CategoryRow } from './CategoryRow';
import { AddCategoryButton } from '../AddCategoryButton';
import { useCategoryDragDrop } from '@/hooks/useCategoryDragDrop';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { TABLE_CELL_STYLES, TABLE_Z_INDEX } from '@/constants/tableStyles';

interface TableSectionProps {
  title: string;
  section: string;
  categories: EditableCategoryData[];
  bgColor: string;
  textColor: string;
  currentMonth: number;
  selectedCell: CellPosition | null;
  onAddCategory: () => void;
  onCategoryNameChange: (section: keyof any, categoryId: string, newName: string) => void;
  onValueChange: (section: keyof any, categoryId: string, monthIndex: number, value: number) => void;
  onCategoryRemove: (section: keyof any, categoryId: string) => void;
  onCategoryReorder: (section: keyof any, fromIndex: number, toIndex: number) => void;
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
  bgColor,
  textColor,
  currentMonth,
  selectedCell,
  onAddCategory,
  onCategoryNameChange,
  onValueChange,
  onCategoryRemove,
  onCategoryReorder,
  onCellSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  isInFillRange,
}) => {
  const categoryDragDrop = useCategoryDragDrop();

  // Calcular totais por mês
  const totals = Array(12).fill(0).map((_, monthIndex) =>
    categories.reduce((sum, category) => sum + (category.values[monthIndex] || 0), 0)
  );

  const handleCategoryDragEnd = () => {
    const result = categoryDragDrop.endDrag();
    if (result && result.section === section) {
      onCategoryReorder(section as keyof any, result.fromIndex, result.toIndex);
    }
  };

  return (
    <>
      {/* Header da seção com botão de adicionar */}
      <TableRow className={bgColor}>
        <TableCell className={cn(
          TABLE_CELL_STYLES.HEADER,
          `font-bold sticky left-0 border-r ${bgColor} ${textColor}`,
          TABLE_Z_INDEX.SECTION_HEADER
        )}>
          <div className="flex items-center justify-between">
            <span>{title}</span>
            <AddCategoryButton onClick={onAddCategory} />
          </div>
        </TableCell>
        {totals.map((total, index) => (
          <TableCell 
            key={index} 
            className={cn(
              TABLE_CELL_STYLES.HEADER,
              `text-center font-semibold ${textColor}`,
              getCurrentMonthColumnStyle(index === currentMonth)
            )}
          >
            {formatCurrency(total)}
          </TableCell>
        ))}
      </TableRow>
      
      {/* Linhas das categorias */}
      {categories.map((category, index) => (
        <CategoryRow
          key={category.id}
          category={category}
          section={section}
          sectionTitle={title}
          currentMonth={currentMonth}
          categoryIndex={index}
          selectedCell={selectedCell}
          onCategoryNameChange={onCategoryNameChange}
          onValueChange={onValueChange}
          onCategoryRemove={onCategoryRemove}
          onCellSelect={onCellSelect}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          isInFillRange={isInFillRange}
          onCategoryDragStart={categoryDragDrop.startDrag}
          onCategoryDragOver={categoryDragDrop.dragOver}
          onCategoryDragEnd={handleCategoryDragEnd}
          isDraggedCategory={categoryDragDrop.dragState.draggedIndex === index && categoryDragDrop.dragState.section === section}
          isDragOverCategory={categoryDragDrop.dragState.dragOverIndex === index && categoryDragDrop.dragState.section === section}
        />
      ))}
    </>
  );
};
