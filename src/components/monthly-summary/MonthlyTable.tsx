
import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MonthlySummaryData, MONTHS_SHORT } from '@/types/monthly-summary';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MonthlyTableProps {
  data: MonthlySummaryData;
  onCategoryClick?: (category: string, month: number) => void;
}

export const MonthlyTable: React.FC<MonthlyTableProps> = ({
  data,
  onCategoryClick
}) => {
  const handleCategoryClick = (category: string, month: number) => {
    if (onCategoryClick) {
      onCategoryClick(category, month);
    }
  };

  // Obter todas as categorias únicas
  const allRevenue = new Set<string>();
  const allEssential = new Set<string>();
  const allNonEssential = new Set<string>();
  const allReserves = new Set<string>();

  data.months.forEach(month => {
    month.revenue.forEach(cat => allRevenue.add(cat.category));
    month.essentialExpenses.forEach(cat => allEssential.add(cat.category));
    month.nonEssentialExpenses.forEach(cat => allNonEssential.add(cat.category));
    month.monthlyReserves.forEach(cat => allReserves.add(cat.category));
  });

  const getCategoryAmount = (monthData: any[], category: string): number => {
    const found = monthData.find(cat => cat.category === category);
    return found ? found.amount : 0;
  };

  return (
    <Card className="w-full">
      <ScrollArea className="w-full">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-48 font-bold bg-gray-50 sticky left-0 z-20">
                  Categoria
                </TableHead>
                {MONTHS_SHORT.map((month, index) => (
                  <TableHead key={index} className="text-center min-w-[100px] font-bold">
                    {month}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* RECEITAS */}
              <TableRow className="bg-green-50">
                <TableCell className="font-bold bg-green-100 sticky left-0 z-10">
                  RECEITAS (R)
                </TableCell>
                {data.months.map((month, index) => (
                  <TableCell key={index} className="text-center font-semibold text-green-700">
                    {formatCurrency(month.totalRevenue)}
                  </TableCell>
                ))}
              </TableRow>
              
              {Array.from(allRevenue).map(category => (
                <TableRow 
                  key={`revenue-${category}`}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <TableCell className="bg-white sticky left-0 z-10 pl-8">
                    {data.months[0]?.revenue.find(r => r.category === category)?.displayName || category}
                  </TableCell>
                  {data.months.map((month, index) => (
                    <TableCell 
                      key={index} 
                      className="text-center"
                      onClick={() => handleCategoryClick(category, index)}
                    >
                      {formatCurrency(getCategoryAmount(month.revenue, category))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* DESPESAS ESSENCIAIS */}
              <TableRow className="bg-red-50">
                <TableCell className="font-bold bg-red-100 sticky left-0 z-10">
                  DESPESAS ESSENCIAIS (D1)
                </TableCell>
                {data.months.map((month, index) => (
                  <TableCell key={index} className="text-center font-semibold text-red-700">
                    {formatCurrency(month.totalEssentialExpenses)}
                  </TableCell>
                ))}
              </TableRow>
              
              {Array.from(allEssential).map(category => (
                <TableRow 
                  key={`essential-${category}`}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <TableCell className="bg-white sticky left-0 z-10 pl-8">
                    {data.months[0]?.essentialExpenses.find(e => e.category === category)?.displayName || category}
                  </TableCell>
                  {data.months.map((month, index) => (
                    <TableCell 
                      key={index} 
                      className="text-center"
                      onClick={() => handleCategoryClick(category, index)}
                    >
                      {formatCurrency(getCategoryAmount(month.essentialExpenses, category))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* DESPESAS NÃO ESSENCIAIS */}
              <TableRow className="bg-orange-50">
                <TableCell className="font-bold bg-orange-100 sticky left-0 z-10">
                  DESPESAS NÃO ESSENCIAIS (D2)
                </TableCell>
                {data.months.map((month, index) => (
                  <TableCell key={index} className="text-center font-semibold text-orange-700">
                    {formatCurrency(month.totalNonEssentialExpenses)}
                  </TableCell>
                ))}
              </TableRow>
              
              {Array.from(allNonEssential).map(category => (
                <TableRow 
                  key={`non-essential-${category}`}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <TableCell className="bg-white sticky left-0 z-10 pl-8">
                    {data.months[0]?.nonEssentialExpenses.find(ne => ne.category === category)?.displayName || category}
                  </TableCell>
                  {data.months.map((month, index) => (
                    <TableCell 
                      key={index} 
                      className="text-center"
                      onClick={() => handleCategoryClick(category, index)}
                    >
                      {formatCurrency(getCategoryAmount(month.nonEssentialExpenses, category))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* RESERVAS MENSAIS */}
              <TableRow className="bg-blue-50">
                <TableCell className="font-bold bg-blue-100 sticky left-0 z-10">
                  RESERVAS MENSAIS
                </TableCell>
                {data.months.map((month, index) => (
                  <TableCell key={index} className="text-center font-semibold text-blue-700">
                    {formatCurrency(month.totalReserves)}
                  </TableCell>
                ))}
              </TableRow>
              
              {Array.from(allReserves).map(category => (
                <TableRow 
                  key={`reserves-${category}`}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <TableCell className="bg-white sticky left-0 z-10 pl-8">
                    {data.months[0]?.monthlyReserves.find(r => r.category === category)?.displayName || category}
                  </TableCell>
                  {data.months.map((month, index) => (
                    <TableCell 
                      key={index} 
                      className="text-center"
                      onClick={() => handleCategoryClick(category, index)}
                    >
                      {formatCurrency(getCategoryAmount(month.monthlyReserves, category))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* SOBRA MENSAL */}
              <TableRow className="bg-gray-100 border-t-2">
                <TableCell className="font-bold text-lg bg-gray-200 sticky left-0 z-10">
                  SOBRA MENSAL
                </TableCell>
                {data.months.map((month, index) => (
                  <TableCell 
                    key={index} 
                    className={cn(
                      "text-center font-bold text-lg",
                      month.monthlySurplus >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {formatCurrency(month.monthlySurplus)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </Card>
  );
};
