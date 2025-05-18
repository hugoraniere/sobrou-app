
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface TransactionsErrorStateProps {
  errorMessage?: string;
  onRetry: () => void;
}

export const TransactionsErrorState: React.FC<TransactionsErrorStateProps> = ({
  errorMessage,
  onRetry
}) => {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Erro ao carregar transações</h3>
      <p className="text-gray-600 mb-4">
        {errorMessage || "Não foi possível carregar suas transações. Verifique sua conexão e tente novamente."}
      </p>
      <Button onClick={onRetry} className="flex items-center gap-2">
        <RefreshCcw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </Card>
  );
};
