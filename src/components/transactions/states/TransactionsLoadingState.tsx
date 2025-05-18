
import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface TransactionsLoadingStateProps {
  message?: string;
  timeout?: number;
}

export const TransactionsLoadingState: React.FC<TransactionsLoadingStateProps> = ({ 
  message = "Carregando transações...",
  timeout = 15000
}) => {
  const [longLoading, setLongLoading] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLongLoading(true);
    }, timeout / 2);
    
    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
      {longLoading ? (
        <div className="space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <div>
            <p className="font-medium text-gray-900">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Isso está demorando mais do que o esperado. 
              Verificando todas as suas transações...
            </p>
          </div>
        </div>
      ) : (
        <LoadingSpinner message={message} timeout={timeout} />
      )}
    </Card>
  );
};
