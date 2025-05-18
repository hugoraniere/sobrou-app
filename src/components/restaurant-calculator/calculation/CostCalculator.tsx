
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CostCalculation } from '@/types/restaurant-calculator';
import { formatCurrency, formatPercentage, formatWeight } from '@/utils/calculationUtils';
import { Card } from '@/components/ui/card';

interface CostCalculatorProps {
  calculation: CostCalculation;
}

const CostCalculator: React.FC<CostCalculatorProps> = ({ calculation }) => {
  const {
    ingredients,
    total_ingredients_cost,
    operational_cost,
    tax_cost,
    total_cost,
    suggested_price,
    margin
  } = calculation;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingrediente</TableHead>
              <TableHead className="text-right">Qtd. Bruta</TableHead>
              <TableHead className="text-right">Merma</TableHead>
              <TableHead className="text-right">Qtd. Líquida</TableHead>
              <TableHead className="text-right">Custo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.ingredient.name}</TableCell>
                <TableCell className="text-right">
                  {formatWeight(item.gross_weight, item.ingredient.unit)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercentage(item.ingredient.waste_percentage)}
                </TableCell>
                <TableCell className="text-right">
                  {formatWeight(item.net_weight, item.ingredient.unit)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.cost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Resumo de Custos</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span>Custo total de ingredientes:</span>
            <span className="font-medium">{formatCurrency(total_ingredients_cost)}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b">
            <span>Custos operacionais:</span>
            <span className="font-medium">{formatCurrency(operational_cost)}</span>
          </div>
          
          {tax_cost > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span>Impostos:</span>
              <span className="font-medium">{formatCurrency(tax_cost)}</span>
            </div>
          )}
          
          <div className="flex justify-between py-2 border-b font-medium">
            <span>Custo Total:</span>
            <span>{formatCurrency(total_cost)}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b text-lg font-bold">
            <span>Preço de Venda Sugerido:</span>
            <span className="text-primary">{formatCurrency(suggested_price)}</span>
          </div>
          
          <div className="flex justify-between py-2">
            <span>Margem efetiva:</span>
            <span className="font-medium">{formatPercentage(margin)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CostCalculator;
