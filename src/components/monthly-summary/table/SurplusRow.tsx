
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency, cn } from '@/lib/utils';

interface MonthlyTotals {
  revenue: number;
  essential: number;
  nonEssential: number;
  reserves: number;
  surplus: number;
}

interface SurplusRowProps {
  totals: MonthlyTotals[];
  currentMonth: number;
}

export const SurplusRow: React.FC<SurplusRowProps> = ({ totals, currentMonth }) => {
  return (
    <TableRow className="border-t-2 border-gray-300 bg-gray-50">
      <TableCell className="font-bold text-gray-700 sticky left-0 z-10 bg-gray-50 text-xs px-2 py-2 border-r">
        SUPERÁVIT (R - D1 - D2 - Reservas)
      </TableCell>
      {totals.map((monthTotal, index) => (
        <TableCell 
          key={index} 
          className={cn(
            "text-center font-bold text-xs px-1 py-2",
            monthTotal.surplus >= 0 ? "text-green-600" : "text-red-600",
            index === currentMonth && "bg-blue-100 border-r-2 border-blue-500"
          )}
        >
          {formatCurrency(monthTotal.surplus)}
        </TableCell>
      ))}
    </TableRow>
  );
};
