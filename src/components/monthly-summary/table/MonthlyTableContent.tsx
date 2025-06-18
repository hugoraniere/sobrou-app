
import React, { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from 'lucide-react';
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
  
  // Estado para controlar seções abertas/fechadas
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('monthlyTableOpenSections');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback para formato antigo
      }
    }
    return {
      revenue: true,
      essentialExpenses: true,
      nonEssentialExpenses: true,
      reserves: true
    };
  });

  // Persistir estado no localStorage
  useEffect(() => {
    localStorage.setItem('monthlyTableOpenSections', JSON.stringify(openSections));
  }, [openSections]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  return (
    <div className={cn("overflow-x-auto", isMobile && "max-w-[calc(100vw-2rem)]")}>
      <Table className="min-w-full">
        {/* Header global dos meses - SEMPRE VISÍVEL */}
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
          {sections.map((sectionData) => {
            const sectionTotals = getSectionTotals(sectionData.categories);
            const isOpen = openSections[sectionData.section];
            
            return (
              <React.Fragment key={sectionData.section}>
                {/* Header da seção com totais - usando Collapsible */}
                <Collapsible 
                  open={isOpen}
                  onOpenChange={() => toggleSection(sectionData.section)}
                  asChild
                >
                  <>
                    <CollapsibleTrigger asChild>
                      <TableRow className={cn(
                        "cursor-pointer hover:bg-opacity-80 transition-colors",
                        sectionData.bgColor,
                        "border-b-2"
                      )}>
                        <TableCell className={cn(
                          TABLE_CELL_STYLES.HEADER,
                          "sticky left-0 border-r font-bold",
                          sectionData.bgColor,
                          sectionData.textColor,
                          TABLE_Z_INDEX.SECTION_HEADER
                        )}>
                          <div className="flex items-center gap-2">
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            {sectionData.title}
                          </div>
                        </TableCell>
                        {sectionTotals.map((total, index) => (
                          <TableCell 
                            key={index} 
                            className={cn(
                              TABLE_CELL_STYLES.HEADER,
                              "text-center font-semibold text-sm",
                              sectionData.textColor,
                              getCurrentMonthColumnStyle(index === currentMonth)
                            )}
                          >
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(total)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </CollapsibleTrigger>
                    
                    {/* Conteúdo da seção */}
                    <CollapsibleContent asChild>
                      <>
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
                      </>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              </React.Fragment>
            );
          })}
          
          {/* Linha de surplus */}
          <SurplusRow 
            totals={totals}
            currentMonth={currentMonth}
          />
        </TableBody>
      </Table>
    </div>
  );
};
