import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { TableSection } from './TableSection';
import { SurplusRow } from './SurplusRow';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { TABLE_COLUMN_WIDTHS, TABLE_CELL_STYLES, TABLE_Z_INDEX } from '@/constants/tableStyles';

interface MonthlyTableContentProps {
  data: any;
  totals: any;
  currentMonth: number;
  selectedCell: any;
  handlers: any;
  onAddCategory: (section: string, sectionTitle: string) => void;
  onValueChange: (section: string, categoryId: string, monthIndex: number, value: number) => void;
  onCategoryReorder: (section: string, fromIndex: number, toIndex: number) => void;
  isInFillRange: (position: any) => boolean;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const MonthlyTableContent: React.FC<MonthlyTableContentProps> = ({
  data,
  totals,
  currentMonth,
  selectedCell,
  handlers,
  onAddCategory,
  onValueChange,
  onCategoryReorder,
  isInFillRange,
}) => {
  const { isMobile } = useResponsive();

  const sections = [
    {
      title: 'RECEITAS',
      section: 'revenue' as const,
      categories: data.revenue,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
    },
    {
      title: 'GASTOS ESSENCIAIS',
      section: 'essentialExpenses' as const,
      categories: data.essentialExpenses,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
    },
    {
      title: 'GASTOS NÃO ESSENCIAIS',
      section: 'nonEssentialExpenses' as const,
      categories: data.nonEssentialExpenses,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
    },
    {
      title: 'RESERVAS',
      section: 'reserves' as const,
      categories: data.reserves,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
    }
  ];

  return (
    <div className={cn("overflow-x-auto", isMobile && "max-w-[calc(100vw-2rem)]")}>
      <Table className="min-w-full">
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
            {months.map((month, index) => (
              <TableHead 
                key={month} 
                className={cn(
                  TABLE_COLUMN_WIDTHS.MONTH,
                  TABLE_CELL_STYLES.HEADER,
                  "text-center",
                  getCurrentMonthColumnStyle(index === currentMonth)
                )}
              >
                {month}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((sectionData) => (
            <TableSection
              key={sectionData.title}
              title={sectionData.title}
              section={sectionData.section}
              categories={sectionData.categories}
              bgColor={sectionData.bgColor}
              textColor={sectionData.textColor}
              currentMonth={currentMonth}
              selectedCell={selectedCell}
              onAddCategory={() => onAddCategory(sectionData.section, sectionData.title)}
              onCategoryNameChange={handlers.handleCategoryNameChange}
              onValueChange={onValueChange}
              onCategoryRemove={handlers.handleCategoryRemove}
              onCategoryReorder={onCategoryReorder}
              onCellSelect={handlers.handleCellSelect}
              onDragStart={handlers.handleDragStart}
              onDragMove={handlers.handleDragMove}
              onDragEnd={handlers.handleDragEnd}
              isInFillRange={isInFillRange}
            />
          ))}
          
          <SurplusRow 
            totals={totals}
            currentMonth={currentMonth}
          />
        </TableBody>
      </Table>
    </div>
  );
};
