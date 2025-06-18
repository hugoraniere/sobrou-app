
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { 
  TABLE_COLUMN_WIDTHS, 
  TABLE_CELL_STYLES, 
  TABLE_Z_INDEX,
  getSelectedMonthHeaderStyle,
  getCurrentMonthHeaderStyle
} from '@/constants/tableStyles';

interface ComparativeTableHeaderProps {
  months: string[];
  selectedMonth: number;
  currentMonth: number;
  onMonthClick: (monthIndex: number) => void;
}

export const ComparativeTableHeader: React.FC<ComparativeTableHeaderProps> = ({
  months,
  selectedMonth,
  currentMonth,
  onMonthClick
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className={cn(
          TABLE_COLUMN_WIDTHS.CATEGORY,
          TABLE_CELL_STYLES.HEADER,
          "sticky left-0 bg-white border-r",
          TABLE_Z_INDEX.STICKY_CATEGORY
        )}>
          Categoria
        </TableHead>
        <TableHead className={cn(
          TABLE_COLUMN_WIDTHS.PLANNING_SPECIAL,
          TABLE_CELL_STYLES.HEADER,
          "text-center bg-gray-100 border-l-4 border-gray-400"
        )}>
          Planejado ({months[selectedMonth]})
        </TableHead>
        {months.map((month, index) => (
          <TableHead 
            key={month} 
            className={cn(
              TABLE_COLUMN_WIDTHS.MONTH,
              TABLE_CELL_STYLES.HEADER,
              "text-center cursor-pointer hover:bg-gray-50 transition-colors",
              getSelectedMonthHeaderStyle(index === selectedMonth),
              getCurrentMonthHeaderStyle(index === currentMonth && index !== selectedMonth)
            )}
            onClick={() => onMonthClick(index)}
          >
            {month}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
