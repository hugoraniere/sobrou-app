
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { AddCategoryDialog } from './AddCategoryDialog';
import { AddCategoryButton } from './AddCategoryButton';
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { formatCurrencyInput, parseCurrencyToNumber } from '@/utils/currencyUtils';
import { 
  ConstrainedTable, 
  ConstrainedTableHeader, 
  ConstrainedTableBody, 
  ConstrainedTableRow, 
  ConstrainedTableHead,
  ConstrainedTableCell 
} from './table/ConstrainedTable';

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
      <ConstrainedTableRow className={cn(className, "font-semibold")}>
        <ConstrainedTableCell colSpan={2}>
          <div className="flex items-center justify-between">
            <span>{title}</span>
            <AddCategoryButton onClick={onAddCategory} />
          </div>
        </ConstrainedTableCell>
      </ConstrainedTableRow>
      
      {/* Categorias da seção */}
      {categories.map((category) => {
        return (
          <ConstrainedTableRow key={category.id} className="hover:bg-gray-50">
            <ConstrainedTableCell className="font-medium">
              {category.displayName}
            </ConstrainedTableCell>
            <ConstrainedTableCell className="text-center">
              <Input
                type="text"
                className="text-center max-w-32 mx-auto"
                value={category.monthlyValue === 0 ? '' : formatCurrencyInput(category.monthlyValue.toString())}
                onChange={(e) => handleValueChange(category.id, e.target.value)}
                placeholder="0,00"
              />
            </ConstrainedTableCell>
          </ConstrainedTableRow>
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

  // Definir larguras das colunas responsivamente
  const getCategoryColumnWidth = () => isMobile ? "150px" : "200px";
  const getValueColumnWidth = () => isMobile ? "120px" : "150px";

  return (
    <>
      <div className="w-full overflow-x-auto">
        <ConstrainedTable 
          style={{ 
            minWidth: isMobile ? "270px" : "350px"
          }}
        >
          <ConstrainedTableHeader>
            <ConstrainedTableRow>
              <ConstrainedTableHead 
                className="sticky left-0 bg-white border-r-2 border-gray-300 z-30 font-semibold"
                style={{ width: getCategoryColumnWidth() }}
              >
                Categoria
              </ConstrainedTableHead>
              <ConstrainedTableHead 
                className="text-center font-semibold"
                style={{ width: getValueColumnWidth() }}
              >
                Valor Planejado (Mensal)
              </ConstrainedTableHead>
            </ConstrainedTableRow>
          </ConstrainedTableHeader>
          <ConstrainedTableBody>
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
          </ConstrainedTableBody>
        </ConstrainedTable>
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
