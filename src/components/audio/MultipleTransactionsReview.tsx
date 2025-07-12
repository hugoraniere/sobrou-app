import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import { EditableTransactionRow } from './EditableTransactionRow';
import { ParsedExpense } from '@/services/transactions/types';

interface TransactionWithId extends ParsedExpense {
  id: string;
}

interface MultipleTransactionsReviewProps {
  transactions: TransactionWithId[];
  onUpdateTransaction: (id: string, data: Partial<ParsedExpense>) => void;
  onRemoveTransaction: (id: string) => void;
  onConfirmAll: () => void;
  onBack: () => void;
  transcriptionText?: string;
  onAddNewTransaction?: (transaction: Partial<ParsedExpense>) => void;
}

export const MultipleTransactionsReview: React.FC<MultipleTransactionsReviewProps> = ({
  transactions,
  onUpdateTransaction,
  onRemoveTransaction,
  onConfirmAll,
  onBack,
  transcriptionText,
  onAddNewTransaction
}) => {
  const totalAmount = transactions.reduce((sum, transaction) => {
    return sum + (transaction.type === 'expense' ? -transaction.amount : transaction.amount);
  }, 0);

  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  const incomeCount = transactions.filter(t => t.type === 'income').length;

  const isValidTransaction = (transaction: TransactionWithId) => {
    return transaction.description.trim() && transaction.amount > 0 && transaction.category;
  };

  const allTransactionsValid = transactions.every(isValidTransaction);

  const handleAddNewTransaction = () => {
    if (onAddNewTransaction) {
      onAddNewTransaction({
        description: '',
        amount: 0,
        category: 'compras',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Revisar Transações</h3>
            <p className="text-sm text-muted-foreground">
              {transactions.length} transação{transactions.length !== 1 ? 'ões' : ''} detectada{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {allTransactionsValid ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gastos</span>
              <Badge variant="destructive">{expenseCount}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Receitas</span>
              <Badge variant="secondary">{incomeCount}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Saldo</span>
              <span className={`font-medium ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {Math.abs(totalAmount).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcription Preview */}
      {transcriptionText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Transcrição Original</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">{transcriptionText}</p>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Editar Transações</h4>
          {onAddNewTransaction && (
            <Button variant="outline" size="sm" onClick={handleAddNewTransaction}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Transação
            </Button>
          )}
        </div>
        
        {/* Headers (Desktop only) */}
        <div className="hidden md:grid md:grid-cols-7 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
          <div>#</div>
          <div className="md:col-span-2">Descrição</div>
          <div>Valor</div>
          <div>Tipo</div>
          <div>Categoria</div>
          <div className="text-right">Ações</div>
        </div>

        {/* Transaction Rows */}
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <EditableTransactionRow
              key={transaction.id}
              transaction={transaction}
              onUpdate={onUpdateTransaction}
              onRemove={onRemoveTransaction}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t justify-end">
        <Button variant="outline" onClick={onBack} className="w-auto px-4">
          Voltar
        </Button>
        
        <Button 
          onClick={onConfirmAll}
          disabled={!allTransactionsValid || transactions.length === 0}
          className="w-auto px-4"
        >
          Salvar {transactions.length} Transação{transactions.length !== 1 ? 'ões' : ''}
        </Button>
      </div>

      {!allTransactionsValid && (
        <p className="text-sm text-amber-600 text-center">
          Verifique se todas as transações possuem descrição, valor e categoria válidos.
        </p>
      )}
    </div>
  );
};