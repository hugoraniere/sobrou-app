
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
  const isOverdue = !bill.is_paid && new Date(bill.due_date) < new Date();

  return (
    <>
      <Card className={cn(
        "w-full transition-all duration-200 hover:shadow-sm border-gray-200",
        bill.is_paid && "opacity-60"
      )}>
        <CardContent className="p-3">
          {/* Linha principal compacta: Título, Badges, Valor, Saldo, Data, Ações */}
          <div className="flex items-center justify-between gap-3">
            {/* Seção esquerda: Título e badges */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h3 className={cn(
                "text-sm font-medium text-gray-900 truncate",
                bill.is_paid && "line-through text-gray-500"
              )}>
                {bill.title}
              </h3>
              
              {/* Badges minimalistas */}
              <div className="flex items-center gap-1">
                {bill.is_recurring && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gray-300 text-gray-500 h-4">
                    <Repeat className="h-2.5 w-2.5 mr-0.5" />
                    {frequencyLabels[bill.recurrence_frequency]}
                  </Badge>
                )}
                
                {bill.is_paid && (
                  <span className="text-[10px] text-green-600 font-medium">Paga</span>
                )}
                
                {isFullyPaid && !bill.is_paid && (
                  <span className="text-[10px] text-green-600 font-medium">Quitada</span>
                )}
                
                {isOverdue && !bill.is_paid && !isFullyPaid && (
                  <span className="text-[10px] text-red-600 font-medium">Vencida</span>
                )}
              </div>
            </div>
            
            {/* Seção central: Valores */}
            <div className="flex items-center gap-3 text-[10px]">
              <div className="text-right">
                <div className="text-gray-500 mb-0.5">Valor</div>
                <div className={cn(
                  "font-medium text-xs",
                  bill.is_paid ? "text-gray-500" : "text-gray-900"
                )}>
                  {formatCurrency(bill.amount)}
                </div>
              </div>
              
              {hasTransactions && (
                <div className="text-right">
                  <div className="text-gray-500 mb-0.5">Saldo</div>
                  <div className={cn(
                    "font-medium text-xs",
                    isFullyPaid ? "text-green-600" : "text-orange-600"
                  )}>
                    {formatCurrency(Math.max(0, currentBalance))}
                  </div>
                </div>
              )}
              
              <div className="text-right">
                <div className="text-gray-500 mb-0.5">Vencimento</div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Calendar className="h-2.5 w-2.5" />
                  <span className="font-medium text-xs">
                    {format(new Date(bill.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>

            {/* Seção direita: Ações compactas */}
            <div className="flex items-center gap-0.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransactionsDialogOpen(true)}
                className="h-6 px-2 text-[10px] border-gray-300 hover:bg-gray-50"
              >
                <History className="h-2.5 w-2.5 mr-1" />
                Transações
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTogglePaid(bill.id, !bill.is_paid)}
                className={cn(
                  "h-6 w-6 p-0 border-gray-300 hover:bg-gray-50",
                  bill.is_paid && "bg-green-50 border-green-300 hover:bg-green-100"
                )}
              >
                {bill.is_paid ? (
                  <X className="h-2.5 w-2.5 text-green-700" />
                ) : (
                  <Check className="h-2.5 w-2.5 text-gray-600" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(bill)}
                className="h-6 w-6 p-0 border-gray-300 hover:bg-gray-50"
              >
                <Edit2 className="h-2.5 w-2.5 text-gray-600" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(bill.id)}
                className="h-6 w-6 p-0 border-gray-300 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-2.5 w-2.5 text-gray-600 hover:text-red-600" />
              </Button>
            </div>
          </div>

          {/* Linha secundária: Descrição e notas (apenas se existirem) */}
          {(bill.description || bill.notes) && (
            <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
              {bill.description && (
                <p className={cn(
                  "text-[11px] text-gray-600 leading-tight",
                  bill.is_paid && "text-gray-400"
                )}>
                  {bill.description}
                </p>
              )}

              {bill.notes && (
                <p className={cn(
                  "text-[10px] text-gray-500 leading-tight",
                  bill.is_paid && "text-gray-400"
                )}>
                  <span className="font-medium">Obs:</span> {bill.notes}
                </p>
              )}
            </div>
          )}

          {/* Próximo vencimento para recorrentes */}
          {bill.is_recurring && bill.next_due_date && !bill.is_paid && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-[10px] text-blue-600 leading-tight">
                Próximo: {format(new Date(bill.next_due_date), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          )}
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
