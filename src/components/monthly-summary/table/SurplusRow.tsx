import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency, cn } from '@/lib/utils';
import { getCurrentMonthCellStyle } from '@/utils/monthStyleUtils';
import { TABLE_Z_INDEX, CATEGORY_COLUMN_BORDER } from '@/constants/tableStyles';

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
      <TableCell className={cn(
        "font-bold text-gray-700 sticky left-0 bg-gray-50 text-xs px-2 py-1",
        CATEGORY_COLUMN_BORDER,
        TABLE_Z_INDEX.STICKY_CATEGORY
      )}>
        SOBRA MENSAL
      </TableCell>
      {totals.map((monthTotal, index) => (
        <TableCell 
          key={index} 
          className={cn(
            "text-center font-bold text-xs px-1 py-1",
            monthTotal.surplus >= 0 ? "text-green-600" : "text-red-600",
            getCurrentMonthCellStyle(index === currentMonth)
          )}
        >
          {formatCurrency(monthTotal.surplus)}
        </TableCell>
      ))}
    </TableRow>
  );
};
