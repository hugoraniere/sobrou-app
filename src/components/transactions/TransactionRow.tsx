
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from '@/services/TransactionService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RepeatIcon } from "lucide-react";

interface TransactionRowProps {
  transaction: Transaction;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onToggleRecurring,
  formatDate 
}) => {
  return (
    <TableRow key={transaction.id}>
      <TableCell>{formatDate(transaction.date)}</TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {transaction.type === 'income' ? 'Income' : 'Expense'}
        </span>
      </TableCell>
      <TableCell>{transaction.category}</TableCell>
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
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onToggleRecurring(transaction.id, !!transaction.is_recurring)}
            >
              {transaction.is_recurring ? 'Remove recurring' : 'Mark as recurring'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
