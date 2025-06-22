
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { 
  getCategoryColumnWidth, 
  getMonthColumnWidth, 
  getTableCellClass, 
  TABLE_Z_INDEX,
  getCurrentMonthHeaderStyle,
  getSelectedMonthHeaderStyle
} from '@/constants/tableStyles';

interface ComparativeTableHeaderProps {
  months: string[];
  currentMonth: number;
  selectedMonth: number;
  onMonthClick: (monthIndex: number) => void;
}

export const ComparativeTableHeader: React.FC<ComparativeTableHeaderProps> = ({
  months,
  currentMonth,
  selectedMonth,
  onMonthClick
}) => {
  const { isMobile } = useResponsive();

  return (
    <TableHeader>
      <TableRow>
        <TableHead className={cn(
          getCategoryColumnWidth(isMobile),
          getTableCellClass('HEADER'),
          "sticky left-0 bg-white border-r",
          TABLE_Z_INDEX.STICKY_CATEGORY
        )}>
          Categoria
        </TableHead>
        <TableHead className={cn(
          getMonthColumnWidth(isMobile), // Usar a mesma largura dos meses
          getTableCellClass('HEADER'),
          "text-center bg-gray-100 border-l-4 border-gray-400"
        )}>
          Planejado ({months[selectedMonth]})
        </TableHead>
        {months.map((month, index) => (
          <TableHead 
            key={month} 
            className={cn(
              getMonthColumnWidth(isMobile),
              getTableCellClass('HEADER'),
              "text-center cursor-pointer hover:bg-gray-50",
              getCurrentMonthHeaderStyle(index === currentMonth),
              getSelectedMonthHeaderStyle(index === selectedMonth)
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
