import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Bill } from '@/types/bills';
import { differenceInDays } from 'date-fns';

interface BillsSummaryCardsProps {
  bills: Bill[];
}

export const BillsSummaryCards: React.FC<BillsSummaryCardsProps> = ({ bills }) => {
  const today = new Date();
  const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);

  // Contas deste mês (pendentes)
  const thisMonthBills = bills.filter((bill) => {
    if (bill.is_paid) return false;
    const dueDate = new Date(bill.due_date);
    return (
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  });

  const thisMonthTotal = thisMonthBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Contas nos próximos 15 dias (pendentes)
  const next15DaysBills = bills.filter((bill) => {
    if (bill.is_paid) return false;
    const dueDate = new Date(bill.due_date);
    return dueDate >= today && dueDate <= in15Days;
  });

  const next15DaysTotal = next15DaysBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Contas atrasadas
  const overdueBills = bills.filter((bill) => {
    if (bill.is_paid) return false;
    const dueDate = new Date(bill.due_date);
    return dueDate < today;
  });

  const overdueTotal = overdueBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Este Mês */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Calendar className="h-4 w-4" />
                <span>Este Mês</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(thisMonthTotal)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {thisMonthBills.length} conta{thisMonthBills.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximos 15 Dias */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Clock className="h-4 w-4" />
                <span>Próximos 15 Dias</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(next15DaysTotal)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {next15DaysBills.length} conta{next15DaysBills.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Atrasadas */}
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Atrasadas</span>
              </div>
              <div className="text-2xl font-bold text-red-700">
                {formatCurrency(overdueTotal)}
              </div>
              <div className="text-xs text-red-500 mt-1">
                {overdueBills.length} conta{overdueBills.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
