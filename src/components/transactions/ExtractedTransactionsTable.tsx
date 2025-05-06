
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ExtractedTransaction } from '@/services/bankStatementService';
import { Badge } from '@/components/ui/badge';
import { transactionCategories } from '@/data/categories';

interface ExtractedTransactionsTableProps {
  transactions: ExtractedTransaction[];
  onToggleSelection: (index: number) => void;
}

export const ExtractedTransactionsTable: React.FC<ExtractedTransactionsTableProps> = ({
  transactions,
  onToggleSelection,
}) => {
  // Função para obter label de categoria pelo ID
  const getCategoryName = (categoryId?: string): string => {
    if (!categoryId) return 'Outros';
    
    const category = transactionCategories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Nenhuma transação encontrada
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox 
                    checked={tx.selected} 
                    onCheckedChange={() => onToggleSelection(index)}
                  />
                </TableCell>
                <TableCell>{formatDate(tx.date)}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  <span title={tx.description}>
                    {tx.description}
                  </span>
                </TableCell>
                <TableCell>
                  {tx.category ? (
                    <Badge variant="outline" className="capitalize">
                      {getCategoryName(tx.category)}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Outros</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={tx.type === 'income' ? 'success' : 'destructive'}
                    className="capitalize"
                  >
                    {tx.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(tx.amount)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
