
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { EditableCategoryData } from '@/hooks/useEditableMonthlySummary';
import { CellPosition } from '@/hooks/useDragFill';
import { CategoryRow } from './CategoryRow';
import { AddCategoryButton } from '../AddCategoryButton';
import { useCategoryDragDrop } from '@/hooks/useCategoryDragDrop';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { TABLE_CELL_STYLES, TABLE_Z_INDEX, CATEGORY_COLUMN_BORDER } from '@/constants/tableStyles';

interface TableSectionProps {
  title: string;
  section: string;
  categories: EditableCategoryData[];
  bgColor: string;
  textColor: string;
  currentMonth: number;
  selectedCell: CellPosition | null;
  isExpanded: boolean;
  onToggleExpanded: () => void;
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
  isExpanded,
  onToggleExpanded,
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

  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <>
      {/* Header da seção - agora clicável */}
      <TableRow className={cn(bgColor, "hover:opacity-80 transition-opacity")}>
        <TableCell 
          className={cn(
            TABLE_CELL_STYLES.HEADER,
            `font-bold sticky left-0 ${bgColor} ${textColor} cursor-pointer`,
            CATEGORY_COLUMN_BORDER,
            TABLE_Z_INDEX.SECTION_HEADER,
            "flex items-center gap-2"
          )}
          onClick={onToggleExpanded}
        >
          <ChevronIcon 
            size={16} 
            className={cn(
              "transition-transform duration-200",
              isExpanded ? "rotate-0" : "rotate-0"
            )} 
          />
          {title}
        </TableCell>
        {totals.map((total, index) => (
          <TableCell 
            key={index} 
            className={cn(
              TABLE_CELL_STYLES.HEADER,
              `text-center font-semibold ${textColor} cursor-pointer`,
              getCurrentMonthColumnStyle(index === currentMonth)
            )}
            onClick={onToggleExpanded}
          >
            {formatCurrency(total)}
          </TableCell>
        ))}
      </TableRow>
      
      {/* Linhas das categorias - mostradas apenas se expandido */}
      {isExpanded && (
        <>
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
          
          {/* Linha para adicionar categoria - MOVIDA PARA O FINAL e visível apenas quando expandido */}
          <TableRow className={cn(bgColor.replace('50', '25'), 'hover:bg-opacity-80')}>
            <TableCell className={cn(
              TABLE_CELL_STYLES.CATEGORY_CELL,
              "sticky left-0",
              CATEGORY_COLUMN_BORDER,
              bgColor.replace('50', '25'),
              TABLE_Z_INDEX.SECTION_HEADER
            )}>
              <AddCategoryButton 
                onClick={onAddCategory}
                className="w-full justify-center text-gray-600 hover:text-gray-800"
              />
            </TableCell>
            {Array(12).fill(0).map((_, index) => (
              <TableCell 
                key={index} 
                className={cn(
                  TABLE_CELL_STYLES.DATA_CELL,
                  getCurrentMonthColumnStyle(index === currentMonth), // Esta função agora inclui o z-index baixo
                  bgColor.replace('50', '25')
                )}
              />
            ))}
          </TableRow>
        </>
      )}
    </>
  );
};
