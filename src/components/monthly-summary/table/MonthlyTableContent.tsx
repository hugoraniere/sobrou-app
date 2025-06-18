
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { TableSection } from './TableSection';
import { SurplusRow } from './SurplusRow';
import { getCurrentMonthColumnStyle } from '@/utils/monthStyleUtils';
import { TABLE_COLUMN_WIDTHS, TABLE_CELL_STYLES, TABLE_Z_INDEX } from '@/constants/tableStyles';
import { formatCurrency } from '@/lib/utils';

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
  
  // Estado para controlar seções abertas/fechadas
  const [openSections, setOpenSections] = useState<string[]>(() => {
    const stored = localStorage.getItem('monthlyTableOpenSections');
    return stored ? JSON.parse(stored) : ['revenue', 'essentialExpenses', 'nonEssentialExpenses', 'reserves'];
  });

  // Persistir estado no localStorage
  useEffect(() => {
    localStorage.setItem('monthlyTableOpenSections', JSON.stringify(openSections));
  }, [openSections]);

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

  // Calcular totais por seção e mês
  const getSectionTotals = (categories: any[]) => {
    return Array(12).fill(0).map((_, monthIndex) =>
      categories.reduce((sum, category) => sum + (category.values[monthIndex] || 0), 0)
    );
  };

  // Header compartilhado para todas as tabelas
  const TableHeaderComponent = () => (
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
  );

  return (
    <div className={cn("overflow-x-auto", isMobile && "max-w-[calc(100vw-2rem)]")}>
      <Accordion 
        type="multiple" 
        value={openSections}
        onValueChange={setOpenSections}
        className="w-full space-y-4"
      >
        {sections.map((sectionData) => {
          const sectionTotals = getSectionTotals(sectionData.categories);
          
          return (
            <AccordionItem key={sectionData.section} value={sectionData.section} className="border rounded-lg">
              <AccordionTrigger className={cn(
                "hover:no-underline px-0 py-3 font-bold text-left",
                sectionData.bgColor,
                sectionData.textColor
              )}>
                <div className="w-full grid" style={{ gridTemplateColumns: `${TABLE_COLUMN_WIDTHS.CATEGORY.replace('min-w-[', '').replace(']', '')} repeat(12, ${TABLE_COLUMN_WIDTHS.MONTH.replace('min-w-[', '').replace(']', '')})` }}>
                  <div className="px-4 py-1 font-bold">
                    {sectionData.title}
                  </div>
                  {sectionTotals.map((total, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "text-center text-sm font-semibold px-1",
                        getCurrentMonthColumnStyle(index === currentMonth)
                      )}
                    >
                      {formatCurrency(total)}
                    </div>
                  ))}
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="p-0">
                <Table className="min-w-full">
                  <TableHeaderComponent />
                  <TableBody>
                    <TableSection
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
                      hideHeader={true}
                    />
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      
      {/* Tabela separada para a linha de surplus */}
      <div className="mt-4">
        <Table className="min-w-full">
          <TableHeaderComponent />
          <TableBody>
            <SurplusRow 
              totals={totals}
              currentMonth={currentMonth}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
