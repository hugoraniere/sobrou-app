
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ExtractedTransaction } from '@/services/bankStatementService';
import { Badge } from '@/components/ui/badge';
import { transactionCategories } from '@/data/categories';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Edit2, AlertCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExtractedTransactionsTableProps {
  transactions: ExtractedTransaction[];
  onToggleSelection: (index: number) => void;
  onUpdateCategory?: (index: number, newCategory: string) => void;
}

export const ExtractedTransactionsTable: React.FC<ExtractedTransactionsTableProps> = ({
  transactions,
  onToggleSelection,
  onUpdateCategory,
}) => {
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [popoverOpenStates, setPopoverOpenStates] = useState<Record<number, boolean>>({});
  
  // Função para obter label de categoria pelo ID
  const getCategoryName = (categoryId?: string): string => {
    if (!categoryId) return 'Outros';
    
    const category = transactionCategories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Verificar se uma categoria é válida no sistema
  const isCategoryValid = (categoryId?: string): boolean => {
    if (!categoryId) return false;
    return transactionCategories.some(c => c.id === categoryId);
  };
  
  // Contar categorias inválidas
  const invalidCategoriesCount = transactions.filter(tx => !isCategoryValid(tx.category) && tx.selected).length;
  
  // Função para alterar a categoria de uma transação
  const handleCategoryChange = (index: number, categoryId: string) => {
    if (onUpdateCategory) {
      onUpdateCategory(index, categoryId);
    }
    
    // Fechar o popover para este índice específico
    handlePopoverOpenChange(index, false);
  };
  
  // Função para gerenciar o estado de abertura dos popovers individualmente
  const handlePopoverOpenChange = (index: number, isOpen: boolean) => {
    setPopoverOpenStates(prev => ({
      ...prev,
      [index]: isOpen
    }));
  };
  
  return (
    <div className="space-y-2">
      {invalidCategoriesCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-2 text-amber-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{invalidCategoriesCount} {invalidCategoriesCount === 1 ? 'categoria precisa' : 'categorias precisam'} de revisão</span>
        </div>
      )}
      
      <ScrollArea className="h-[400px] border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-left">Valor</TableHead>
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
                <TableRow key={index} className={!isCategoryValid(tx.category) ? "bg-amber-50" : ""}>
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
                    <div className="flex items-center gap-2">
                      <Popover 
                        open={popoverOpenStates[index]} 
                        onOpenChange={(open) => handlePopoverOpenChange(index, open)}
                      >
                        <PopoverTrigger asChild>
                          <Badge 
                            variant={isCategoryValid(tx.category) ? "outline" : "destructive"} 
                            className="capitalize cursor-pointer hover:bg-gray-100 flex items-center gap-1"
                          >
                            {getCategoryName(tx.category)}
                            {!isCategoryValid(tx.category) && (
                              <AlertCircle className="h-3 w-3 ml-1" />
                            )}
                            <Edit2 className="h-3 w-3 text-gray-400" />
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Selecione uma categoria:
                            </p>
                            <div className="grid grid-cols-2 gap-1 max-h-[200px] overflow-y-auto">
                              {transactionCategories.map((category) => (
                                <div
                                  key={category.id}
                                  className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer"
                                  onClick={() => handleCategoryChange(index, category.id)}
                                >
                                  <span className="flex h-5 w-5 items-center justify-center">
                                    {category.icon && <category.icon className="h-4 w-4" />}
                                  </span>
                                  <span className="text-sm">{category.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={tx.type === 'income' ? 'success' : 'destructive'}
                      className="capitalize"
                    >
                      {tx.type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left font-mono">
                    <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(tx.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
