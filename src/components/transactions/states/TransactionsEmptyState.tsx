
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TransactionsEmptyStateProps {
  onAddTransaction: () => void;
}

export const TransactionsEmptyState: React.FC<TransactionsEmptyStateProps> = ({ onAddTransaction }) => {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center">
      <h3 className="text-xl font-semibold mb-2">Nenhuma transação encontrada</h3>
      <p className="text-gray-500 mb-4">
        Você ainda não possui transações registradas. Adicione sua primeira transação agora!
      </p>
      <Button onClick={onAddTransaction}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar transação
      </Button>
    </Card>
  );
};
