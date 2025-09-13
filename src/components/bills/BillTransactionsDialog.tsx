
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, History } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { TransactionsList } from './TransactionsList';
import { BillTransactionBalance } from './BillTransactionBalance';
import { useBillTransactions, useBillBalance } from '@/hooks/useBillTransactions';
import { Bill } from '@/types/bills';
import { CreateBillTransactionData } from '@/types/billTransactions';

interface BillTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: Bill;
}

export const BillTransactionsDialog: React.FC<BillTransactionsDialogProps> = ({
  open,
  onOpenChange,
  bill,
}) => {
  const [activeTab, setActiveTab] = useState('history');
  const {
    transactions,
    isLoading,
    createTransaction,
    deleteTransaction,
    isCreating,
    isDeleting,
  } = useBillTransactions(bill.id);

  const { data: balanceData } = useBillBalance(bill.id, bill.amount);

  const handleSubmitTransaction = (data: CreateBillTransactionData) => {
    createTransaction(data);
    setActiveTab('history');
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta transação?')) {
      deleteTransaction(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transações - {bill.title}
          </DialogTitle>
        </DialogHeader>

        <BillTransactionBalance
          originalAmount={bill.amount}
          currentBalance={balanceData?.current_balance || bill.amount}
          transactionsTotal={balanceData?.transactions_total || 0}
          hasTransactions={transactions.length > 0}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico ({transactions.length})
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando transações...</p>
              </div>
            ) : (
              <TransactionsList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                isDeleting={isDeleting}
              />
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <TransactionForm
              billId={bill.id}
              onSubmit={handleSubmitTransaction}
              onCancel={() => setActiveTab('history')}
              isSubmitting={isCreating}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
