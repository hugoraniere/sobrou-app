
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { EditableCell } from '../EditableCell';
import { CellPosition } from '@/hooks/useDragFill';
import { cn } from '@/lib/utils';

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
        <TableCell className={`font-bold sticky left-0 z-10 text-xs px-2 h-6 ${className.replace('50', '100')}`}>
          {title}
        </TableCell>
        {totals.map((total, index) => (
          <TableCell 
            key={index} 
            className={cn(
              "text-center font-semibold text-xs px-1 h-6",
              index === currentMonth && "bg-blue-50"
            )}
          >
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </TableCell>
        ))}
      </TableRow>
      
      {/* Linhas das categorias */}
      {categories.map(category => (
        <TableRow key={category.id} className="hover:bg-gray-50">
          <TableCell className="bg-white sticky left-0 z-10 pl-4 text-xs px-2 h-6">
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
                  "p-0.5 h-6",
                  monthIndex === currentMonth && "bg-blue-50"
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
