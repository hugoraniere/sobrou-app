
import React from 'react';
import { Transaction } from '@/services/transactions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RepeatIcon, PencilIcon, Trash2 } from "lucide-react";

interface TransactionActionsProps {
  transaction: Transaction;
  onEdit: () => void;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  onDelete: () => void;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({
  transaction,
  onEdit,
  onToggleRecurring,
  onDelete
}) => {
  return (
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
          onEdit();
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
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionActions;
