
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { ComparativeTooltip } from '../ComparativeTooltip';
import { formatCurrency, cn } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { TABLE_CELL_STYLES, TABLE_Z_INDEX } from '@/constants/tableStyles';

interface CategoryData {
  id: string;
  displayName: string;
  values: number[];
}

interface ComparativeTableRowProps {
  realCategory: CategoryData;
  planningCategory?: CategoryData;
  currentMonth: number;
  months: string[];
}

export const ComparativeTableRow: React.FC<ComparativeTableRowProps> = ({
  realCategory,
  planningCategory,
  currentMonth,
  months
}) => {
  const getVarianceColor = (real: number, planned: number) => {
    if (planned === 0) return 'text-gray-500';
    const variance = Math.abs(((real - planned) / planned) * 100);
    if (variance <= 5) return 'bg-green-50 text-green-700';
    if (variance <= 15) return 'bg-yellow-50 text-yellow-700';
    return 'bg-red-50 text-red-700';
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className={cn(
        TABLE_CELL_STYLES.CATEGORY_CELL,
        "font-medium sticky left-0 bg-white border-r",
        TABLE_Z_INDEX.SECTION_HEADER
      )}>
        {realCategory.displayName}
      </TableCell>
      
      {/* Coluna de valor planejado para o mês atual */}
      <TableCell className={cn(
        TABLE_CELL_STYLES.DATA_CELL,
        "text-center bg-gray-100 font-medium border-l-4 border-gray-400"
      )}>
        {formatCurrency(
          planningCategory?.values[currentMonth] || 0
        )}
      </TableCell>
      
      {/* Colunas dos meses */}
      {months.map((month, monthIndex) => {
        const realValue = realCategory.values[monthIndex] || 0;
        const plannedValue = planningCategory?.values[monthIndex] || 0;
        
        return (
          <TableCell 
            key={monthIndex} 
            className={cn(
              TABLE_CELL_STYLES.DATA_CELL,
              "text-center",
              getVarianceColor(realValue, plannedValue),
              getCurrentMonthColumnStyle(monthIndex === currentMonth)
            )}
          >
            <ComparativeTooltip
              realValue={realValue}
              plannedValue={plannedValue}
              categoryName={realCategory.displayName}
              monthName={month}
            >
              <div className="cursor-help p-1 rounded">
                {formatCurrency(realValue)}
              </div>
            </ComparativeTooltip>
          </TableCell>
        );
      })}
    </TableRow>
  );
};
