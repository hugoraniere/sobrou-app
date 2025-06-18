
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { EditableCell } from '../EditableCell';
import { AddCategoryButton } from '../AddCategoryButton';
import { CellPosition } from '@/hooks/useDragFill';
import { cn } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { formatCurrency } from '@/lib/utils';
import { TABLE_CELL_STYLES, TABLE_Z_INDEX, getSectionColor } from '@/constants/tableStyles';

interface PlanningCategoryData {
  id: string;
  displayName: string;
  values: number[];
}

interface PlanningTableSectionProps {
  title: string;
  section: string;
  sectionKey: 'REVENUE' | 'ESSENTIAL' | 'NON_ESSENTIAL' | 'RESERVES';
  categories: PlanningCategoryData[];
  updateCategoryValue: (section: string, categoryId: string, monthIndex: number, value: number) => void;
  onAddCategory: () => void;
  dragFill: any;
  onDragFillEnd: () => void;
}

export const PlanningTableSection: React.FC<PlanningTableSectionProps> = ({
  title,
  section,
  sectionKey,
  categories,
  updateCategoryValue,
  onAddCategory,
  dragFill,
  onDragFillEnd
}) => {
  // Calcular totais por mês
  const totals = Array(12).fill(0).map((_, monthIndex) =>
    categories.reduce((sum, category) => sum + (category.values[monthIndex] || 0), 0)
  );

  const currentMonth = new Date().getMonth();
  const sectionColors = getSectionColor(sectionKey);

  return (
    <>
      {/* Header da seção com botão de adicionar */}
      <TableRow className={sectionColors.bg}>
        <TableCell className={cn(
          TABLE_CELL_STYLES.HEADER,
          `font-bold sticky left-0 border-r ${sectionColors.bg} ${sectionColors.text}`,
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
              `text-center font-semibold ${sectionColors.text}`,
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
