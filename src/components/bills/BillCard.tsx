
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

  return (
    <>
      <Card className={cn(
        "w-full transition-all duration-200 hover:shadow-sm border-gray-200",
        bill.is_paid && "opacity-70"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {/* Linha principal: Título, Valor e Data */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <h3 className={cn(
                    "text-lg font-semibold text-gray-900 truncate",
                    bill.is_paid && "line-through text-gray-500"
                  )}>
                    {bill.title}
                  </h3>
                  
                  {/* Badges essenciais */}
                  <div className="flex items-center gap-2">
                    {bill.is_recurring && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border-gray-300 text-gray-600">
                        <Repeat className="h-3 w-3 mr-1" />
                        {frequencyLabels[bill.recurrence_frequency]}
                      </Badge>
                    )}
                    
                    {bill.is_paid && (
                      <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-700 border-green-200">
                        Paga
                      </Badge>
                    )}
                    
                    {isFullyPaid && !bill.is_paid && (
                      <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-700 border-green-200">
                        Quitada
                      </Badge>
                    )}
                    
                    {isOverdue && !bill.is_paid && !isFullyPaid && (
                      <Badge variant="destructive" className="text-xs px-2 py-0.5">
                        Vencida
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Valor e Data na mesma linha */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-0.5">Valor</div>
                    <div className={cn(
                      "font-semibold text-lg",
                      bill.is_paid ? "text-gray-500" : "text-gray-900"
                    )}>
                      {formatCurrency(bill.amount)}
                    </div>
                  </div>
                  
                  {hasTransactions && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-0.5">Saldo</div>
                      <div className={cn(
                        "font-semibold text-lg",
                        isFullyPaid ? "text-green-600" : "text-orange-600"
                      )}>
                        {formatCurrency(Math.max(0, currentBalance))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-0.5">Vencimento</div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <Calendar className="h-3 w-3" />
                      <span className="font-medium">
                        {format(new Date(bill.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações secundárias */}
              {(bill.description || bill.notes) && (
                <div className="space-y-1">
                  {bill.description && (
                    <p className={cn(
                      "text-sm text-gray-600",
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
                </div>
              )}

              {/* Próximo vencimento para recorrentes */}
              {bill.is_recurring && bill.next_due_date && !bill.is_paid && (
                <p className="text-xs text-blue-600 mt-2">
                  Próximo vencimento: {format(new Date(bill.next_due_date), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              )}
            </div>

            {/* Botões de ação - mais compactos */}
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransactionsDialogOpen(true)}
                className="h-7 px-2 text-xs border-gray-300 hover:bg-gray-50"
              >
                <History className="h-3 w-3 mr-1" />
                Transações
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTogglePaid(bill.id, !bill.is_paid)}
                className={cn(
                  "h-7 w-7 p-0 border-gray-300 hover:bg-gray-50",
                  bill.is_paid && "bg-green-50 border-green-300 hover:bg-green-100"
                )}
              >
                {bill.is_paid ? (
                  <X className="h-3 w-3 text-green-700" />
                ) : (
                  <Check className="h-3 w-3 text-gray-600" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(bill)}
                className="h-7 w-7 p-0 border-gray-300 hover:bg-gray-50"
              >
                <Edit2 className="h-3 w-3 text-gray-600" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(bill.id)}
                className="h-7 w-7 p-0 border-gray-300 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-3 w-3 text-gray-600 hover:text-red-600" />
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
