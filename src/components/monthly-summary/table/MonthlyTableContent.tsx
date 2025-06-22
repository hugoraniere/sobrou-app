
import React, { useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { TableSection } from './TableSection';
import { SurplusRow } from './SurplusRow';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { 
  ConstrainedTable, 
  ConstrainedTableHeader, 
  ConstrainedTableBody, 
  ConstrainedTableRow, 
  ConstrainedTableHead 
} from './ConstrainedTable';

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

  // Definir larguras das colunas responsivamente
  const getCategoryColumnWidth = () => isMobile ? "120px" : "140px";
  const getMonthColumnWidth = () => isMobile ? "45px" : "60px";

  return (
    <div className="w-full overflow-x-auto">
      <ConstrainedTable 
        style={{ 
          minWidth: isMobile ? "660px" : "800px"
        }}
      >
        <ConstrainedTableHeader>
          <ConstrainedTableRow>
            <ConstrainedTableHead 
              className={cn(
                "sticky left-0 bg-white border-r-2 border-gray-300 z-30",
                "font-semibold"
              )}
              style={{ width: getCategoryColumnWidth() }}
            >
              Categoria
            </ConstrainedTableHead>
            {months.map((month, index) => (
              <ConstrainedTableHead 
                key={`month-${index}`}
                className={cn(
                  "text-center font-semibold",
                  getCurrentMonthColumnStyle(index === currentMonth)
                )}
                style={{ width: getMonthColumnWidth() }}
              >
                {month}
              </ConstrainedTableHead>
            ))}
          </ConstrainedTableRow>
        </ConstrainedTableHeader>
        <ConstrainedTableBody>
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
        </ConstrainedTableBody>
      </ConstrainedTable>
    </div>
  );
};
