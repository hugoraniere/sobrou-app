
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
  // Garantir que bgColor é uma string válida antes de usar replace
  const safeBgColor = bgColor || 'bg-gray-50';
  const headerBgColor = safeBgColor.includes('50') ? safeBgColor.replace('50', '100') : `${safeBgColor}-100`;

  return (
    <TableRow className={safeBgColor}>
      <TableCell className={`font-bold ${headerBgColor} sticky left-0 z-10 text-xs px-2 h-6`}>
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
