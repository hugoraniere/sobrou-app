import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bill } from '@/types/bills';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InstallmentSeriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bills: Bill[];
}

export const InstallmentSeriesModal: React.FC<InstallmentSeriesModalProps> = ({
  open,
  onOpenChange,
  bills,
}) => {
  if (!bills.length) return null;

  const sortedBills = [...bills].sort(
    (a, b) => (a.installment_index || 0) - (b.installment_index || 0)
  );

  const paidCount = sortedBills.filter(b => b.is_paid).length;
  const totalAmount = sortedBills.reduce((sum, b) => sum + Number(b.amount), 0);
  const paidAmount = sortedBills
    .filter(b => b.is_paid)
    .reduce((sum, b) => sum + Number(b.amount), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Série de Parcelas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso:</span>
              <span className="font-semibold">
                {paidCount} de {sortedBills.length} pagas
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Valor Total:</span>
              <span className="font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Valor Pago:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(paidAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Valor Restante:</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(totalAmount - paidAmount)}
              </span>
            </div>
          </div>

          {/* Lista de parcelas */}
          <div className="space-y-2">
            {sortedBills.map((bill) => (
              <div
                key={bill.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  bill.is_paid ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {bill.is_paid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium">
                      Parcela {bill.installment_index}/{bill.installment_total}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(bill.due_date), "dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(bill.amount)}</div>
                  {bill.is_paid && bill.paid_date && (
                    <div className="text-xs text-green-600">
                      Pago em {format(new Date(bill.paid_date), 'dd/MM/yyyy')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
