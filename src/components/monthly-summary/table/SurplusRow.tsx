
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SurplusRowProps {
  totals: Array<{ surplus: number }>;
  currentMonth: number;
}

export const SurplusRow: React.FC<SurplusRowProps> = ({ totals, currentMonth }) => {
  return (
    <TableRow className="bg-gray-100 border-t-2">
      <TableCell className="font-bold text-xs bg-gray-200 sticky left-0 z-10 px-2 h-7">
        SOBRA MENSAL
      </TableCell>
      {totals.map((total, index) => (
        <TableCell 
          key={index} 
          className={cn(
            "text-center font-bold text-xs px-1 h-7",
            total.surplus >= 0 ? "text-green-600" : "text-red-600",
            index === currentMonth && "bg-blue-50"
          )}
        >
          {formatCurrency(total.surplus)}
        </TableCell>
      ))}
    </TableRow>
  );
};
