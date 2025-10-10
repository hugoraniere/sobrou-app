import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { MEIMonthlyReport } from '@/services/meiReportService';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';

interface MEIClosingTableProps {
  report: MEIMonthlyReport;
}

export const MEIClosingTable: React.FC<MEIClosingTableProps> = ({ report }) => {
  const monthName = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ][report.period.month - 1];

  return (
    <div id="mei-closing-report" className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Fechamento MEI - {monthName}/{report.period.year}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Este relatório é apenas para controle interno e não substitui documentos oficiais
          </p>
        </CardHeader>
      </Card>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <TrendingUp className="h-4 w-4" />
              <span>Receita Total</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(report.revenue.total)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {report.revenue.count} transação{report.revenue.count !== 1 ? 'ões' : ''}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <TrendingDown className="h-4 w-4" />
              <span>Custos Totais</span>
            </div>
            <div className="text-2xl font-bold text-red-700">
              {formatCurrency(report.costs.total)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <PiggyBank className="h-4 w-4" />
              <span>Impostos ({report.taxPercentage}%)</span>
            </div>
            <div className="text-2xl font-bold text-yellow-700">
              {formatCurrency(report.taxReserve)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <DollarSign className="h-4 w-4" />
              <span>Lucro Líquido</span>
            </div>
            <div className={`text-2xl font-bold ${report.profit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {formatCurrency(report.profit)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Margem: {report.margin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Custos por Categoria */}
      {report.costs.byCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Transações</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">% do Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.costs.byCategory.map((category) => (
                  <TableRow key={category.category}>
                    <TableCell className="font-medium">{category.category}</TableCell>
                    <TableCell className="text-center">{category.count}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(category.amount)}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {((category.amount / report.costs.total) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-center">
                    {report.costs.byCategory.reduce((sum, c) => sum + c.count, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(report.costs.total)}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
