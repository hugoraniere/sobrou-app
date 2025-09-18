
import React from 'react';
import { Bill } from '@/types/bills';
import { BillCard } from './BillCard';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface BillsListProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string, isPaid: boolean) => void;
  isLoading?: boolean;
}

export const BillsList: React.FC<BillsListProps> = ({
  bills,
  onEdit,
  onDelete,
  onTogglePaid,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="w-full">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma conta cadastrada
          </h3>
          <p className="text-gray-500">
            Comece adicionando suas primeiras contas a pagar para manter o controle das suas finanças.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-tour-id="bills-to-pay.list.bills-list">
      {bills.map((bill) => (
        <BillCard
          key={bill.id}
          bill={bill}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePaid={onTogglePaid}
        />
      ))}
    </div>
  );
};
