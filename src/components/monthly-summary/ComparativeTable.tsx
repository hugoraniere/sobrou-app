import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUnifiedMonthlySummary } from '@/hooks/useUnifiedMonthlySummary';
import { useResponsive } from '@/hooks/useResponsive';
import { formatCurrency, cn } from '@/lib/utils';

interface ComparativeTableProps {
  year: number;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const ComparativeTable: React.FC<ComparativeTableProps> = ({ year }) => {
  const { realTotals, planningTotals } = useUnifiedMonthlySummary(year);
  const { isMobile } = useResponsive();

  const getVarianceColor = (real: number, planned: number) => {
    if (planned === 0) return 'text-gray-500';
    const variance = ((real - planned) / planned) * 100;
    if (Math.abs(variance) <= 5) return 'text-green-600';
    if (Math.abs(variance) <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVarianceText = (real: number, planned: number) => {
    if (planned === 0) return 'N/A';
    const variance = ((real - planned) / planned) * 100;
    return `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo: Real vs Planejado {year}</CardTitle>
        <CardDescription>
          Compare seus gastos reais com o planejamento financeiro
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className={cn("overflow-x-auto", isMobile && "max-w-[calc(100vw-2rem)]")}>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-20 bg-white border-r min-w-[140px] text-xs">
                  Tipo
                </TableHead>
                {months.map((month, index) => (
                  <TableHead key={month} className="text-center min-w-[120px] text-xs">
                    {month}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Receitas */}
              <TableRow className="bg-green-50">
                <TableCell className="font-semibold sticky left-0 z-10 bg-green-50 text-xs">
                  Receitas (Real)
                </TableCell>
                {realTotals.map((total, index) => (
                  <TableCell key={index} className="text-center text-xs px-1">
                    {formatCurrency(total.revenue)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-green-100">
                <TableCell className="font-semibold sticky left-0 z-10 bg-green-100 text-xs">
                  Receitas (Planejado)
                </TableCell>
                {planningTotals.map((total, index) => (
                  <TableCell key={index} className="text-center text-xs px-1">
                    {formatCurrency(total.revenue)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-green-200">
                <TableCell className="font-semibold sticky left-0 z-10 bg-green-200 text-xs">
                  Variação
                </TableCell>
                {realTotals.map((realTotal, index) => {
                  const plannedTotal = planningTotals[index];
                  return (
                    <TableCell 
                      key={index} 
                      className={cn(
                        "text-center text-xs px-1 font-medium",
                        getVarianceColor(realTotal.revenue, plannedTotal.revenue)
                      )}
                    >
                      {getVarianceText(realTotal.revenue, plannedTotal.revenue)}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Gastos Essenciais */}
              <TableRow className="bg-red-50">
                <TableCell className="font-semibold sticky left-0 z-10 bg-red-50 text-xs">
                  Essenciais (Real)
                </TableCell>
                {realTotals.map((total, index) => (
                  <TableCell key={index} className="text-center text-xs px-1">
                    {formatCurrency(total.essential)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-red-100">
                <TableCell className="font-semibold sticky left-0 z-10 bg-red-100 text-xs">
                  Essenciais (Planejado)
                </TableCell>
                {planningTotals.map((total, index) => (
                  <TableCell key={index} className="text-center text-xs px-1">
                    {formatCurrency(total.essential)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-red-200">
                <TableCell className="font-semibold sticky left-0 z-10 bg-red-200 text-xs">
                  Variação
                </TableCell>
                {realTotals.map((realTotal, index) => {
                  const plannedTotal = planningTotals[index];
                  return (
                    <TableCell 
                      key={index} 
                      className={cn(
                        "text-center text-xs px-1 font-medium",
                        getVarianceColor(realTotal.essential, plannedTotal.essential)
                      )}
                    >
                      {getVarianceText(realTotal.essential, plannedTotal.essential)}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Gastos Não Essenciais */}
              <TableRow className="bg-yellow-50">
                <TableCell className="font-semibold sticky left-0 z-10 bg-yellow-50 text-xs">
                  Não Essenciais (Real)
                </TableCell>
                {realTotals.map((total, index) => (
                  <TableCell key={index} className="text-center text-xs px-1">
                    {formatCurrency(total.nonEssential)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-yellow-100">
                <TableCell className="font-semibold sticky left-0 z-10 bg-yellow-100 text-xs">
                  Não Essenciais (Planejado)
                </TableCell>
                {planningTotals.map((total, index) => (
                  <TableCell key={index} className="text-center text-xs px-1">
                    {formatCurrency(total.nonEssential)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-yellow-200">
                <TableCell className="font-semibold sticky left-0 z-10 bg-yellow-200 text-xs">
                  Variação
                </TableCell>
                {realTotals.map((realTotal, index) => {
                  const plannedTotal = planningTotals[index];
                  return (
                    <TableCell 
                      key={index} 
                      className={cn(
                        "text-center text-xs px-1 font-medium",
                        getVarianceColor(realTotal.nonEssential, plannedTotal.nonEssential)
                      )}
                    >
                      {getVarianceText(realTotal.nonEssential, plannedTotal.nonEssential)}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Sobra */}
              <TableRow className="bg-gray-100 border-t-2">
                <TableCell className="font-bold sticky left-0 z-10 bg-gray-200 text-xs">
                  SOBRA (Real)
                </TableCell>
                {realTotals.map((total, index) => (
                  <TableCell 
                    key={index} 
                    className={cn(
                      "text-center font-bold text-xs px-1",
                      total.surplus >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {formatCurrency(total.surplus)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-gray-200">
                <TableCell className="font-bold sticky left-0 z-10 bg-gray-300 text-xs">
                  SOBRA (Planejado)
                </TableCell>
                {planningTotals.map((total, index) => (
                  <TableCell 
                    key={index} 
                    className={cn(
                      "text-center font-bold text-xs px-1",
                      total.surplus >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {formatCurrency(total.surplus)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
