
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction, TransactionService } from '@/services/TransactionService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MoreHorizontal, RepeatIcon, PencilIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { transactionCategories } from '@/data/categories';

interface TransactionRowProps {
  transaction: Transaction;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
  onTransactionUpdated: () => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onToggleRecurring,
  formatDate,
  onTransactionUpdated
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState<Transaction>({...transaction});

  const handleEdit = () => {
    setEditedTransaction({...transaction});
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await TransactionService.updateTransaction(transaction.id, editedTransaction);
      setIsEditDialogOpen(false);
      onTransactionUpdated();
      toast.success('Transação atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Falha ao atualizar transação');
    }
  };

  const handleDelete = async () => {
    try {
      await TransactionService.deleteTransaction(transaction.id);
      setIsDeleteDialogOpen(false);
      onTransactionUpdated();
      toast.success('Transação excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Falha ao excluir transação');
    }
  };

  const CategoryIcon = transactionCategories.find(cat => cat.id === transaction.category)?.icon;

  return (
    <>
      <TableRow 
        key={transaction.id} 
        className="cursor-pointer hover:bg-gray-50"
        onClick={handleEdit}
      >
        <TableCell>{formatDate(transaction.date)}</TableCell>
        <TableCell>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {CategoryIcon && <CategoryIcon className="h-4 w-4" />}
            {transactionCategories.find(cat => cat.id === transaction.category)?.name || transaction.category}
          </div>
        </TableCell>
        <TableCell>{transaction.description}</TableCell>
        <TableCell className={`text-right font-medium ${
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </TableCell>
        <TableCell>
          {transaction.is_recurring && (
            <div className="flex items-center justify-center">
              <RepeatIcon className="h-4 w-4 text-blue-500" />
            </div>
          )}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.preventDefault();
                handleEdit();
              }}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault();
                  onToggleRecurring(transaction.id, !!transaction.is_recurring);
                }}
              >
                <RepeatIcon className="h-4 w-4 mr-2" />
                {transaction.is_recurring ? 'Remover recorrência' : 'Marcar como recorrente'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
            <DialogDescription>
              Modifique os detalhes da transação abaixo
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Data
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={editedTransaction.date}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <Select 
                name="type" 
                value={editedTransaction.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select 
                name="category" 
                value={editedTransaction.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {transactionCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {React.createElement(category.icon, { className: "h-4 w-4" })}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Input
                id="description"
                name="description"
                value={editedTransaction.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Valor
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={editedTransaction.amount}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Transaction Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionRow;
