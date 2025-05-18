
import React from 'react';
import { LoadingSpinner } from '@/components/ui/spinner';

interface TransactionsLoadingStateProps {
  message?: string;
  timeout?: number;
}

export const TransactionsLoadingState: React.FC<TransactionsLoadingStateProps> = ({ 
  message = "Carregando transações...",
  timeout = 15000
}) => {
  return (
    <LoadingSpinner message={message} timeout={timeout} />
  );
};
