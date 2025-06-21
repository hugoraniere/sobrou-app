
import React, { useState } from 'react';
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

const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

type SectionKey = 'revenue' | 'essentialExpenses' | 'nonEssentialExpenses' | 'reserves';

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

  // Estado para controlar quais seções estão expandidas
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    revenue: true,
    essentialExpenses: true,
    nonEssentialExpenses: true,
    reserves: true,
  });

  const toggleSection = (sectionKey: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const sections = [
    {
      title: 'Receitas',
      section: 'revenue' as const,
      categories: data.revenue,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
    },
    {
      title: 'Gastos Essenciais',
      section: 'essentialExpenses' as const,
      categories: data.essentialExpenses,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
    },
    {
      title: 'Gastos Não Essenciais',
      section: 'nonEssentialExpenses' as const,
      categories: data.nonEssentialExpenses,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
    },
    {
      title: 'Reservas',
      section: 'reserves' as const,
      categories: data.reserves,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
    }
  ];

  return (
    <div className="w-full max-w-[330px] overflow-x-auto">
      <Table className="w-full border-collapse" style={{ minWidth: '600px' }}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px] text-xs px-1 h-6 sticky left-0 bg-white border-r-2 border-gray-300 z-30">
              Categoria
            </TableHead>
            {months.map((month, index) => (
              <TableHead 
                key={month} 
                className={cn(
                  "w-[40px] text-xs px-1 text-center h-6",
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
              isExpanded={expandedSections[sectionData.section]}
              onToggleExpanded={() => toggleSection(sectionData.section)}
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
