
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { EditableCell } from '../EditableCell';
import { CellPosition } from '@/hooks/useDragFill';
import { cn } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { formatCurrency } from '@/lib/utils';
import { TABLE_CELL_STYLES, TABLE_Z_INDEX } from '@/constants/tableStyles';

interface PlanningCategoryData {
  id: string;
  displayName: string;
  values: number[];
}

interface PlanningTableSectionProps {
  title: string;
  section: string;
  categories: PlanningCategoryData[];
  updateCategoryValue: (section: string, categoryId: string, monthIndex: number, value: number) => void;
  dragFill: any;
  onDragFillEnd: () => void;
  className?: string;
}

export const PlanningTableSection: React.FC<PlanningTableSectionProps> = ({
  title,
  section,
  categories,
  updateCategoryValue,
  dragFill,
  onDragFillEnd,
  className = ''
}) => {
  // Calcular totais por mês
  const totals = Array(12).fill(0).map((_, monthIndex) =>
    categories.reduce((sum, category) => sum + (category.values[monthIndex] || 0), 0)
  );

  const currentMonth = new Date().getMonth();

  return (
    <>
      {/* Header da seção */}
      <TableRow className={className}>
        <TableCell className={cn(
          TABLE_CELL_STYLES.HEADER,
          `font-bold sticky left-0 border-r ${className.replace('50', '100')}`,
          TABLE_Z_INDEX.SECTION_HEADER
        )}>
          {title}
        </TableCell>
        {totals.map((total, index) => (
          <TableCell 
            key={index} 
            className={cn(
              TABLE_CELL_STYLES.HEADER,
              "text-center font-semibold",
              getCurrentMonthColumnStyle(index === currentMonth)
            )}
          >
            {formatCurrency(total)}
          </TableCell>
        ))}
      </TableRow>
      
      {/* Linhas das categorias */}
      {categories.map(category => (
        <TableRow key={category.id} className="hover:bg-gray-50">
          <TableCell className={cn(
            TABLE_CELL_STYLES.CATEGORY_CELL,
            "bg-white sticky left-0 pl-4 border-r",
            TABLE_Z_INDEX.SECTION_HEADER
          )}>
            {category.displayName}
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
                  "p-0.5",
                  TABLE_CELL_STYLES.DATA_CELL.replace('py-2', 'py-1'),
                  getCurrentMonthColumnStyle(monthIndex === currentMonth)
                )}
              >
                <EditableCell
                  value={value}
                  onChange={(newValue) => updateCategoryValue(section, category.id, monthIndex, newValue)}
                  position={position}
                  isSelected={dragFill.selectedCell?.categoryId === position.categoryId && 
                            dragFill.selectedCell?.monthIndex === position.monthIndex &&
                            dragFill.selectedCell?.section === position.section}
                  isInFillRange={dragFill.isInFillRange(position)}
                  onCellSelect={dragFill.selectCell}
                  onDragStart={dragFill.startDrag}
                  onDragMove={dragFill.updateDragRange}
                  onDragEnd={onDragFillEnd}
                />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};
