import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bill } from '@/types/bills';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { startOfMonth, endOfMonth, addDays } from 'date-fns';

interface BillsSummaryCardsProps {
  bills: Bill[];
}

export const BillsSummaryCards: React.FC<BillsSummaryCardsProps> = ({ bills }) => {
  const today = new Date();
  const thisMonthStart = startOfMonth(today);
  const thisMonthEnd = endOfMonth(today);
  const next15Days = addDays(today, 15);

  // Filtrar contas não pagas
  const unpaidBills = bills.filter(bill => !bill.is_paid);

  // Este mês
  const thisMonthBills = unpaidBills.filter(bill => {
    const dueDate = new Date(bill.due_date);
    return dueDate >= thisMonthStart && dueDate <= thisMonthEnd;
  });
  const thisMonthTotal = thisMonthBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Próximos 15 dias
  const next15DaysBills = unpaidBills.filter(bill => {
    const dueDate = new Date(bill.due_date);
    return dueDate >= today && dueDate <= next15Days;
  });
  const next15DaysTotal = next15DaysBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Atrasadas
  const overdueBills = unpaidBills.filter(bill => {
    const dueDate = new Date(bill.due_date);
    return dueDate < today;
  });
  const overdueTotal = overdueBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Este Mês */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Este Mês</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(thisMonthTotal)}</p>
              <p className="text-xs text-gray-500 mt-1">{thisMonthBills.length} conta{thisMonthBills.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximos 15 Dias */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Próximos 15 Dias</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(next15DaysTotal)}</p>
              <p className="text-xs text-gray-500 mt-1">{next15DaysBills.length} conta{next15DaysBills.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Atrasadas */}
      <Card className={overdueBills.length > 0 ? 'border-red-200 bg-red-50' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Atrasadas</p>
              <p className={`text-lg font-semibold ${overdueBills.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatCurrency(overdueTotal)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{overdueBills.length} conta{overdueBills.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
