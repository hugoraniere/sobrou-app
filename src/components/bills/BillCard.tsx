import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Edit2, Trash2, Check, X, Repeat, History } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bill } from '@/types/bills';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { BillTransactionsDialog } from './BillTransactionsDialog';
import { useBillBalance } from '@/hooks/useBillTransactions';

interface BillCardProps {
  bill: Bill;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string, isPaid: boolean) => void;
}

const frequencyLabels = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
};

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  onEdit,
  onDelete,
  onTogglePaid,
}) => {
  const [transactionsDialogOpen, setTransactionsDialogOpen] = useState(false);
  
  const { data: balanceData } = useBillBalance(bill.id, bill.amount);
  
  const currentBalance = balanceData?.current_balance || bill.amount;
  const hasTransactions = balanceData?.transactions_total !== 0;
  const isFullyPaid = currentBalance <= 0;
  const hasPartialPayment = hasTransactions && currentBalance > 0 && currentBalance < bill.amount;

  const isOverdue = !bill.is_paid && new Date(bill.due_date) < new Date();
  const isDueSoon = !bill.is_paid && new Date(bill.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <>
      <Card className={cn(
        "w-full transition-all duration-200 hover:shadow-md",
        bill.is_paid && "opacity-60 bg-gray-50",
        isOverdue && !bill.is_paid && "border-red-200 bg-red-50",
        isDueSoon && !bill.is_paid && !isOverdue && "border-yellow-200 bg-yellow-50",
        isFullyPaid && !bill.is_paid && "border-green-200 bg-green-50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={cn(
                  "text-base font-medium text-gray-900 truncate",
                  bill.is_paid && "line-through text-gray-500"
                )}>
                  {bill.title}
                </h3>
                
                {bill.is_recurring && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                    <Repeat className="h-3 w-3" />
                    {frequencyLabels[bill.recurrence_frequency]}
                  </Badge>
                )}
                
                {bill.is_paid && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Paga
                  </Badge>
                )}
                {isFullyPaid && !bill.is_paid && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Quitada
                  </Badge>
                )}
                {hasPartialPayment && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                    Parcial
                  </Badge>
                )}
                {isOverdue && !bill.is_paid && !isFullyPaid && (
                  <Badge variant="destructive">
                    Vencida
                  </Badge>
                )}
                {isDueSoon && !bill.is_paid && !isOverdue && !isFullyPaid && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                    Vence em breve
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Valor Original:</span>
                  <span className={cn(
                    "font-semibold text-base",
                    bill.is_paid ? "text-gray-500" : "text-gray-900"
                  )}>
                    {formatCurrency(bill.amount)}
                  </span>
                </div>
                
                {hasTransactions && (
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Saldo Atual:</span>
                    <span className={cn(
                      "font-semibold text-base",
                      isFullyPaid ? "text-green-600" : "text-orange-600"
                    )}>
                      {formatCurrency(Math.max(0, currentBalance))}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(bill.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </div>

              {bill.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-1",
                  bill.is_paid && "text-gray-400"
                )}>
                  {bill.description}
                </p>
              )}

              {bill.notes && (
                <p className={cn(
                  "text-xs text-gray-500",
                  bill.is_paid && "text-gray-400"
                )}>
                  <span className="font-medium">Obs:</span> {bill.notes}
                </p>
              )}

              {bill.is_recurring && bill.next_due_date && !bill.is_paid && (
                <p className="text-xs text-blue-600 mt-1">
                  Próximo vencimento: {format(new Date(bill.next_due_date), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransactionsDialogOpen(true)}
                className="h-8 px-2 text-xs"
              >
                <History className="h-3 w-3 mr-1" />
                Transações
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTogglePaid(bill.id, !bill.is_paid)}
                className={cn(
                  "h-8 w-8 p-0",
                  bill.is_paid && "bg-green-100 border-green-300 hover:bg-green-200"
                )}
              >
                {bill.is_paid ? (
                  <X className="h-4 w-4 text-green-700" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(bill)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(bill.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <BillTransactionsDialog
        open={transactionsDialogOpen}
        onOpenChange={setTransactionsDialogOpen}
        bill={bill}
      />
    </>
  );
};
