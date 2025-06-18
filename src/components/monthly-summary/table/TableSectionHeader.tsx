
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TableSectionHeaderProps {
  title: string;
  totals: number[];
  currentMonth: number;
  bgColor: string;
  textColor: string;
}

export const TableSectionHeader: React.FC<TableSectionHeaderProps> = ({
  title,
  totals,
  currentMonth,
  bgColor,
  textColor
}) => {
  return (
    <TableRow className={bgColor}>
      <TableCell className={`font-bold ${bgColor.replace('50', '100')} sticky left-0 z-10 text-xs px-2 h-6`}>
        {title}
      </TableCell>
      {totals.map((total, index) => (
        <TableCell 
          key={index} 
          className={cn(
            `text-center font-semibold ${textColor} text-xs px-1 h-6`,
            index === currentMonth && "bg-blue-50"
          )}
        >
          {formatCurrency(total)}
        </TableCell>
      ))}
    </TableRow>
  );
};
