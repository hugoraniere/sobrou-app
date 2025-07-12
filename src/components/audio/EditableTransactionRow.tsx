import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { ParsedExpense } from '@/services/transactions/types';
import { transactionCategories } from '@/data/categories';
import { Badge } from '@/components/ui/badge';

interface TransactionWithId extends ParsedExpense {
  id: string;
}

interface EditableTransactionRowProps {
  transaction: TransactionWithId;
  onUpdate: (id: string, data: Partial<ParsedExpense>) => void;
  onRemove: (id: string) => void;
  index: number;
}

export const EditableTransactionRow: React.FC<EditableTransactionRowProps> = ({
  transaction,
  onUpdate,
  onRemove,
  index
}) => {
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? '' : numValue.toString();
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
    const parsedValue = parseFloat(numericValue);
    if (!isNaN(parsedValue)) {
      onUpdate(transaction.id, { amount: parsedValue });
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = transactionCategories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 border border-border rounded-lg">
      {/* Index */}
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground font-medium">#{index + 1}</span>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <Input
          value={transaction.description}
          onChange={(e) => onUpdate(transaction.id, { description: e.target.value })}
          placeholder="Descrição"
          className="w-full"
        />
      </div>

      {/* Amount */}
      <div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
          <Input
            value={formatCurrency(transaction.amount)}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0,00"
            className="pl-8"
            type="text"
          />
        </div>
      </div>

      {/* Type */}
      <div>
        <Select
          value={transaction.type}
          onValueChange={(value: 'expense' | 'income') => onUpdate(transaction.id, { type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">
              <span className="text-red-600">Gasto</span>
            </SelectItem>
            <SelectItem value="income">
              <span className="text-green-600">Receita</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div>
        <Select
          value={transaction.category}
          onValueChange={(value) => onUpdate(transaction.id, { category: value })}
        >
          <SelectTrigger>
            <SelectValue>
              <Badge variant="outline" className="text-xs">
                {getCategoryLabel(transaction.category)}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {transactionCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(transaction.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};