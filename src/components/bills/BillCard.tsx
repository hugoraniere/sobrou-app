
import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Edit2, Trash2, Check, X, Repeat, History, Receipt, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bill } from '@/types/bills';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { BillTransactionsDialog } from './BillTransactionsDialog';
import { useBillBalance } from '@/hooks/useBillTransactions';
import { useLinkedTransaction } from '@/hooks/useLinkedTransaction';
import { InstallmentSeriesModal } from './InstallmentSeriesModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const [installmentSeriesOpen, setInstallmentSeriesOpen] = useState(false);
  
  const { data: balanceData } = useBillBalance(bill.id, bill.amount);
  const { data: linkedTransaction } = useLinkedTransaction(bill.id, 'bills_to_pay');
  
  // Buscar todas as parcelas da série se for parcelado
  const { data: installmentSeries = [] } = useQuery({
    queryKey: ['installment-series', bill.installment_group_id],
    queryFn: async () => {
      if (!bill.installment_group_id) return [];
      const { data } = await supabase
        .from('bills_to_pay')
        .select('*')
        .eq('installment_group_id', bill.installment_group_id)
        .order('installment_index', { ascending: true });
      return data || [];
    },
    enabled: !!bill.installment_group_id,
  });
  
  const currentBalance = balanceData?.current_balance || bill.amount;
  const hasTransactions = balanceData?.transactions_total !== 0;
  const isFullyPaid = currentBalance <= 0;
  const isOverdue = !bill.is_paid && new Date(bill.due_date) < new Date();
  
  // Calcular proximidade do vencimento
  const daysUntilDue = differenceInDays(new Date(bill.due_date), new Date());
  const isNearDue = !bill.is_paid && !isOverdue && daysUntilDue >= 0 && daysUntilDue <= 3;
  
  // Determinar cor do stroke lateral
  const getCardBorderClass = () => {
    if (isOverdue) return 'border-l-4 border-red-500';
    if (isNearDue) return 'border-l-4 border-yellow-500';
    return 'border-l-4 border-gray-300';
  };

  return (
    <>
      <Card className={cn(
        "w-full transition-all duration-200 hover:shadow-sm border-gray-200",
        getCardBorderClass(),
        bill.is_paid && "opacity-60"
      )}>
        <CardContent className="p-4">
          {/* Layout Desktop */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            {/* Seção esquerda: Título e badges */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <h3 className={cn(
                "text-sm font-medium text-gray-900 truncate",
                bill.is_paid && "line-through text-gray-500"
              )}>
                {bill.title}
              </h3>
              
              {/* Badges maiores */}
              <div className="flex items-center gap-2">
                {bill.installment_total && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-1 border-blue-300 text-blue-600 h-6 cursor-pointer hover:bg-blue-50"
                    onClick={() => setInstallmentSeriesOpen(true)}
                  >
                    <Package className="h-3 w-3 mr-1" />
                    {bill.installment_index}/{bill.installment_total}
                  </Badge>
                )}
                
                {linkedTransaction && (
                  <Badge variant="success" className="text-xs px-2 py-1 h-6">
                    <Receipt className="h-3 w-3 mr-1" />
                    Transação criada
                  </Badge>
                )}
                
                {bill.is_recurring && (
                  <Badge variant="outline" className="text-xs px-2 py-1 border-gray-300 text-gray-600 h-6">
                    <Repeat className="h-3 w-3 mr-1" />
                    {frequencyLabels[bill.recurrence_frequency]}
                  </Badge>
                )}
                
                {bill.is_paid && (
                  <Badge variant="success" className="text-xs px-2 py-1 h-6">
                    Paga
                  </Badge>
                )}
                
                {isFullyPaid && !bill.is_paid && (
                  <Badge variant="success" className="text-xs px-2 py-1 h-6">
                    Quitada
                  </Badge>
                )}
                
                {isOverdue && !bill.is_paid && !isFullyPaid && (
                  <Badge variant="destructive" className="text-xs px-2 py-1 h-6">
                    Vencida
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Seção central: Valores */}
            <div className="flex items-center gap-4">
              <div className="text-left">
                <div className="text-xs text-gray-500 mb-1">Valor</div>
                <div className={cn(
                  "font-medium text-xs",
                  bill.is_paid ? "text-gray-500" : "text-gray-900"
                )}>
                  {formatCurrency(bill.amount)}
                </div>
              </div>
              
              {hasTransactions && (
                <div className="text-left">
                  <div className="text-xs text-gray-500 mb-1">Saldo</div>
                  <div className={cn(
                    "font-medium text-xs",
                    isFullyPaid ? "text-green-600" : "text-orange-600"
                  )}>
                    {formatCurrency(Math.max(0, currentBalance))}
                  </div>
                </div>
              )}
              
              <div className="text-left">
                <div className="text-xs text-gray-500 mb-1">Vencimento</div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium text-xs">
                    {format(new Date(bill.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>

            {/* Seção direita: Ações com melhor espaçamento */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransactionsDialogOpen(true)}
                className="h-7 px-3 text-xs border-gray-300 hover:bg-gray-50"
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

          {/* Layout Mobile - Vertical */}
          <div className="sm:hidden space-y-3">
            {/* Título e badges */}
            <div className="space-y-2">
              <h3 className={cn(
                "text-sm font-medium text-gray-900",
                bill.is_paid && "line-through text-gray-500"
              )}>
                {bill.title}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {bill.is_recurring && (
                  <Badge variant="outline" className="text-xs px-2 py-1 border-gray-300 text-gray-600 h-6">
                    <Repeat className="h-3 w-3 mr-1" />
                    {frequencyLabels[bill.recurrence_frequency]}
                  </Badge>
                )}
                
                {bill.is_paid && (
                  <Badge variant="success" className="text-xs px-2 py-1 h-6">
                    Paga
                  </Badge>
                )}
                
                {isFullyPaid && !bill.is_paid && (
                  <Badge variant="success" className="text-xs px-2 py-1 h-6">
                    Quitada
                  </Badge>
                )}
                
                {isOverdue && !bill.is_paid && !isFullyPaid && (
                  <Badge variant="destructive" className="text-xs px-2 py-1 h-6">
                    Vencida
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Valores */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-left">
                <div className="text-xs text-gray-500 mb-1">Valor</div>
                <div className={cn(
                  "font-medium text-xs",
                  bill.is_paid ? "text-gray-500" : "text-gray-900"
                )}>
                  {formatCurrency(bill.amount)}
                </div>
              </div>
              
              {hasTransactions && (
                <div className="text-left">
                  <div className="text-xs text-gray-500 mb-1">Saldo</div>
                  <div className={cn(
                    "font-medium text-xs",
                    isFullyPaid ? "text-green-600" : "text-orange-600"
                  )}>
                    {formatCurrency(Math.max(0, currentBalance))}
                  </div>
                </div>
              )}
              
              <div className="text-left col-span-2">
                <div className="text-xs text-gray-500 mb-1">Vencimento</div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium text-xs">
                    {format(new Date(bill.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações mobile */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransactionsDialogOpen(true)}
                className="h-7 px-3 text-xs border-gray-300 hover:bg-gray-50 flex-1"
              >
                <History className="h-3 w-3 mr-1" />
                Transações
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTogglePaid(bill.id, !bill.is_paid)}
                className={cn(
                  "h-7 px-3 text-xs border-gray-300 hover:bg-gray-50",
                  bill.is_paid && "bg-green-50 border-green-300 hover:bg-green-100"
                )}
              >
                {bill.is_paid ? (
                  <>
                    <X className="h-3 w-3 mr-1 text-green-700" />
                    Desmarcar
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 mr-1 text-gray-600" />
                    Marcar Paga
                  </>
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

          {/* Linha secundária: Descrição e notas (apenas se existirem) */}
          {(bill.description || bill.notes) && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              {bill.description && (
                <p className={cn(
                  "text-xs text-gray-600 leading-tight",
                  bill.is_paid && "text-gray-400"
                )}>
                  {bill.description}
                </p>
              )}

              {bill.notes && (
                <p className={cn(
                  "text-xs text-gray-500 leading-tight",
                  bill.is_paid && "text-gray-400"
                )}>
                  <span className="font-medium">Obs:</span> {bill.notes}
                </p>
              )}
            </div>
          )}

          {/* Próximo vencimento para recorrentes */}
          {bill.is_recurring && bill.next_due_date && !bill.is_paid && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-blue-600 leading-tight">
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
      
      {bill.installment_group_id && (
        <InstallmentSeriesModal
          open={installmentSeriesOpen}
          onOpenChange={setInstallmentSeriesOpen}
          bills={installmentSeries as Bill[]}
        />
      )}
    </>
  );
};
