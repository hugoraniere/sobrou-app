
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { AddCategoryDialog } from './AddCategoryDialog';
import { AddCategoryButton } from './AddCategoryButton';
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { formatCurrencyInput, parseCurrencyToNumber } from '@/utils/currencyUtils';

interface SimplePlanningTableProps {
  year: number;
}

interface SimplePlanningTableSectionProps {
  title: string;
  section: 'revenue' | 'essentialExpenses' | 'nonEssentialExpenses' | 'reserves';
  categories: Array<{ id: string; displayName: string; monthlyValue: number }>;
  updateCategoryValue: (section: string, categoryId: string, value: number) => void;
  onAddCategory: () => void;
  className?: string;
}

const SimplePlanningTableSection: React.FC<SimplePlanningTableSectionProps> = ({
  title,
  section,
  categories,
  updateCategoryValue,
  onAddCategory,
  className
}) => {
  const handleValueChange = (categoryId: string, inputValue: string) => {
    const numericValue = parseCurrencyToNumber(inputValue);
    updateCategoryValue(section, categoryId, numericValue);
  };

  return (
    <>
      {/* Cabeçalho da seção com botão de adicionar */}
      <TableRow className={cn(className, "font-semibold")}>
        <TableCell colSpan={2} className="py-3">
          <div className="flex items-center justify-between">
            <span>{title}</span>
            <AddCategoryButton onClick={onAddCategory} />
          </div>
        </TableCell>
      </TableRow>
      
      {/* Categorias da seção */}
      {categories.map((category) => {
        return (
          <TableRow key={category.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">
              {category.displayName}
            </TableCell>
            <TableCell className="text-center">
              <Input
                type="text"
                className="text-center max-w-32 mx-auto"
                value={category.monthlyValue === 0 ? '' : formatCurrencyInput(category.monthlyValue.toString())}
                onChange={(e) => handleValueChange(category.id, e.target.value)}
                placeholder="0,00"
              />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export const SimplePlanningTable: React.FC<SimplePlanningTableProps> = ({ year }) => {
  const { 
    simplePlanningData, 
    updateSimplePlanningValue,
    addRealCategory: addCategory
  } = useUnifiedMonthlySummary(year);
  
  const { isMobile } = useResponsive();

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    section: keyof Omit<typeof simplePlanningData, 'year'> | null;
    sectionTitle: string;
  }>({
    open: false,
    section: null,
    sectionTitle: ''
  });

  const updateSimpleValue = (section: string, categoryId: string, monthlyValue: number) => {
    updateSimplePlanningValue(
      section as keyof Omit<typeof simplePlanningData, 'year'>,
      categoryId,
      monthlyValue
    );
  };

  const handleAddCategory = (section: keyof Omit<typeof simplePlanningData, 'year'>, sectionTitle: string) => {
    setDialogState({
      open: true,
      section,
      sectionTitle
    });
  };

  const handleCategorySubmit = (name: string) => {
    if (dialogState.section) {
      addCategory(dialogState.section, name);
    }
  };

  const sections = [
    {
      title: 'RECEITAS',
      section: 'revenue' as const,
      categories: simplePlanningData.revenue,
      className: 'bg-green-50',
    },
    {
      title: 'GASTOS ESSENCIAIS',
      section: 'essentialExpenses' as const,
      categories: simplePlanningData.essentialExpenses,
      className: 'bg-red-50',
    },
    {
      title: 'GASTOS NÃO ESSENCIAIS',
      section: 'nonEssentialExpenses' as const,
      categories: simplePlanningData.nonEssentialExpenses,
      className: 'bg-yellow-50',
    },
    {
      title: 'RESERVAS',
      section: 'reserves' as const,
      categories: simplePlanningData.reserves,
      className: 'bg-blue-50',
    }
  ];

  return (
    <>
      <div className="w-full max-w-full overflow-x-auto">
        <Table className="w-full border-collapse" style={{ 
          minWidth: isMobile ? '100%' : '400px',
          maxWidth: '100%'
        }}>
          <TableHeader>
            <TableRow>
              <TableHead className={cn(
                "text-xs px-1 h-6 sticky left-0 bg-white border-r-2 border-gray-300 z-30",
                isMobile ? "w-[120px]" : "w-[150px]"
              )}>
                Categoria
              </TableHead>
              <TableHead className="w-[150px] text-xs px-1 text-center h-6">
                Valor Planejado (Mensal)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section) => (
              <SimplePlanningTableSection
                key={section.title}
                title={section.title}
                section={section.section}
                categories={section.categories}
                updateCategoryValue={updateSimpleValue}
                onAddCategory={() => handleAddCategory(section.section, section.title)}
                className={section.className}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <AddCategoryDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState({ ...dialogState, open })}
        onAddCategory={handleCategorySubmit}
        sectionTitle={dialogState.sectionTitle}
      />
    </>
  );
};
