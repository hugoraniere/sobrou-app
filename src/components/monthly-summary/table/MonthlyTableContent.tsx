
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MONTHS_SHORT } from '@/types/monthly-summary';
import { cn } from '@/lib/utils';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { TABLE_COLUMN_WIDTHS, TABLE_CELL_STYLES, TABLE_Z_INDEX } from '@/constants/tableStyles';
import { TableSection } from './TableSection';
import { SurplusRow } from './SurplusRow';
import { getSectionConfigs } from './MonthlyTableConfig';
import { EditableCategoryData } from '@/hooks/useEditableMonthlySummary';
import { CellPosition } from '@/hooks/useDragFill';

interface MonthlyTableContentProps {
  data: {
    revenue: EditableCategoryData[];
    essentialExpenses: EditableCategoryData[];
    nonEssentialExpenses: EditableCategoryData[];
    reserves: EditableCategoryData[];
  };
  totals: Array<{
    revenue: number;
    essential: number;
    nonEssential: number;
    reserves: number;
    surplus: number;
  }>;
  currentMonth: number;
  selectedCell: CellPosition | null;
  handlers: {
    handleCategoryNameChange: (section: keyof any, categoryId: string, newName: string) => void;
    handleCellSelect: (position: CellPosition, value: number) => void;
    handleDragStart: (position: CellPosition, value: number) => void;
    handleDragMove: (position: CellPosition) => void;
    handleDragEnd: () => void;
    handleTableClick: (e: React.MouseEvent) => void;
  };
  onAddCategory: (section: keyof any, sectionTitle: string) => void;
  onValueChange: (section: keyof any, categoryId: string, monthIndex: number, value: number) => void;
  isInFillRange: (position: CellPosition) => boolean;
}

export const MonthlyTableContent: React.FC<MonthlyTableContentProps> = ({
  data,
  totals,
  currentMonth,
  selectedCell,
  handlers,
  onAddCategory,
  onValueChange,
  isInFillRange
}) => {
  const sectionConfigs = getSectionConfigs();

  const sections = sectionConfigs.map(config => ({
    ...config,
    categories: data[config.section as keyof typeof data],
    totals: totals.map(t => {
      switch (config.section) {
        case 'revenue': return t.revenue;
        case 'essentialExpenses': return t.essential;
        case 'nonEssentialExpenses': return t.nonEssential;
        case 'reserves': return t.reserves;
        default: return 0;
      }
    })
  }));

  return (
    <ScrollArea className="w-full">
      <div className="min-w-[1000px]" onClick={handlers.handleTableClick}>
        <Table>
          <TableHeader className={cn("sticky top-0 bg-white", TABLE_Z_INDEX.TABLE_HEADER)}>
            <TableRow>
              <TableHead className={cn(
                TABLE_COLUMN_WIDTHS.CATEGORY,
                TABLE_CELL_STYLES.HEADER,
                "font-bold bg-gray-50 sticky left-0 border-r",
                TABLE_Z_INDEX.STICKY_CATEGORY
              )}>
                Categoria
              </TableHead>
              {MONTHS_SHORT.map((month, index) => (
                <TableHead 
                  key={index} 
                  className={cn(
                    TABLE_COLUMN_WIDTHS.MONTH,
                    TABLE_CELL_STYLES.HEADER,
                    "text-center font-bold",
                    getCurrentMonthColumnStyle(index === currentMonth)
                  )}
                >
                  {month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map(sectionConfig => (
              <TableSection
                key={sectionConfig.section}
                title={sectionConfig.title}
                section={sectionConfig.section}
                categories={sectionConfig.categories}
                totals={sectionConfig.totals}
                currentMonth={currentMonth}
                bgColor={sectionConfig.bgColor}
                textColor={sectionConfig.textColor}
                selectedCell={selectedCell}
                onAddCategory={onAddCategory}
                onCategoryNameChange={handlers.handleCategoryNameChange}
                onValueChange={onValueChange}
                onCellSelect={handlers.handleCellSelect}
                onDragStart={handlers.handleDragStart}
                onDragMove={handlers.handleDragMove}
                onDragEnd={handlers.handleDragEnd}
                isInFillRange={isInFillRange}
              />
            ))}

            <SurplusRow totals={totals} currentMonth={currentMonth} />
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};
