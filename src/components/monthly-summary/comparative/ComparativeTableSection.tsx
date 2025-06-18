
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { ComparativeTableRow } from './ComparativeTableRow';
import { cn } from '@/lib/utils';
import { TABLE_CELL_STYLES, TABLE_Z_INDEX, getSectionColor } from '@/constants/tableStyles';

interface CategoryData {
  id: string;
  displayName: string;
  values: number[];
}

interface ComparativeTableSectionProps {
  title: string;
  sectionKey: 'REVENUE' | 'ESSENTIAL' | 'NON_ESSENTIAL' | 'RESERVES';
  realCategories: CategoryData[];
  planningCategories: CategoryData[];
  selectedMonth: number;
  currentMonth: number;
  months: string[];
}

export const ComparativeTableSection: React.FC<ComparativeTableSectionProps> = ({
  title,
  sectionKey,
  realCategories,
  planningCategories,
  selectedMonth,
  currentMonth,
  months
}) => {
  const sectionColors = getSectionColor(sectionKey);

  return (
    <>
      {/* Cabeçalho da seção */}
      <TableRow className={sectionColors.bg}>
        <TableCell 
          colSpan={14} 
          className={cn(
            TABLE_CELL_STYLES.HEADER,
            `font-bold sticky left-0 ${sectionColors.text}`,
            TABLE_Z_INDEX.SECTION_HEADER
          )}
        >
          {title}
        </TableCell>
      </TableRow>
      
      {/* Categorias da seção */}
      {realCategories.map((realCategory) => {
        const planningCategory = planningCategories.find(
          p => p.id === realCategory.id
        );
        
        return (
          <ComparativeTableRow
            key={realCategory.id}
            realCategory={realCategory}
            planningCategory={planningCategory}
            selectedMonth={selectedMonth}
            currentMonth={currentMonth}
            months={months}
          />
        );
      })}
    </>
  );
};
