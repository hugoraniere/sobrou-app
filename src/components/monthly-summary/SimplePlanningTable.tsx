
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { formatCurrency, cn } from '@/lib/utils';
import { formatCurrencyInput, parseCurrencyToNumber } from '@/utils/currencyUtils';

interface SimplePlanningTableProps {
  year: number;
}

interface SimplePlanningTableSectionProps {
  title: string;
  section: 'revenue' | 'essentialExpenses' | 'nonEssentialExpenses' | 'reserves';
  categories: Array<{ id: string; displayName: string; values: number[] }>;
  updateCategoryValue: (section: string, categoryId: string, value: number) => void;
  className?: string;
}

const SimplePlanningTableSection: React.FC<SimplePlanningTableSectionProps> = ({
  title,
  section,
  categories,
  updateCategoryValue,
  className
}) => {
  const handleValueChange = (categoryId: string, inputValue: string) => {
    const numericValue = parseCurrencyToNumber(inputValue);
    updateCategoryValue(section, categoryId, numericValue);
  };

  return (
    <>
      {/* Cabeçalho da seção */}
      <TableRow className={cn(className, "font-semibold")}>
        <TableCell colSpan={2} className="py-3">
          {title}
        </TableCell>
      </TableRow>
      
      {/* Categorias da seção */}
      {categories.map((category) => {
        const averageValue = category.values.reduce((sum, val) => sum + val, 0) / 12;
        
        return (
          <TableRow key={category.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">
              {category.displayName}
            </TableCell>
            <TableCell className="text-center">
              <Input
                type="text"
                className="text-center max-w-32 mx-auto"
                value={averageValue === 0 ? '' : formatCurrencyInput(averageValue.toString())}
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
  const { planningData, updatePlanningValue } = useUnifiedMonthlySummary(year);

  const updateSimpleValue = (section: string, categoryId: string, totalValue: number) => {
    const monthlyValue = totalValue / 12;
    
    // Atualizar todos os 12 meses com o valor distribuído
    for (let month = 0; month < 12; month++) {
      updatePlanningValue(
        section as keyof Omit<typeof planningData, 'year'>,
        categoryId,
        month,
        monthlyValue
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] text-sm">
              Categoria
            </TableHead>
            <TableHead className="text-center min-w-[150px] text-sm">
              Valor Planejado (Mensal)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SimplePlanningTableSection
            title="RECEITAS"
            section="revenue"
            categories={planningData.revenue}
            updateCategoryValue={updateSimpleValue}
            className="bg-green-50"
          />
          
          <SimplePlanningTableSection
            title="GASTOS ESSENCIAIS"
            section="essentialExpenses"
            categories={planningData.essentialExpenses}
            updateCategoryValue={updateSimpleValue}
            className="bg-red-50"
          />
          
          <SimplePlanningTableSection
            title="GASTOS NÃO ESSENCIAIS"
            section="nonEssentialExpenses"
            categories={planningData.nonEssentialExpenses}
            updateCategoryValue={updateSimpleValue}
            className="bg-yellow-50"
          />
          
          <SimplePlanningTableSection
            title="RESERVAS"
            section="reserves"
            categories={planningData.reserves}
            updateCategoryValue={updateSimpleValue}
            className="bg-blue-50"
          />
        </TableBody>
      </Table>
    </div>
  );
};
