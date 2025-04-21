
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TransactionCategoryCell from '@/components/transactions/cells/TransactionCategoryCell';
import TransactionAmountCell from '@/components/transactions/cells/TransactionAmountCell';
import TransactionTypeCell from '@/components/transactions/cells/TransactionTypeCell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface TransactionDetailsProps {
  transaction: {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
    type: string;
  };
  className?: string;
}

/**
 * Displays detailed information about a transaction
 */
const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, className }) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === 'pt-BR' ? ptBR : undefined;

  // Format transaction date for display
  const formattedDate = format(new Date(transaction.date), 'PPP', {
    locale: currentLocale,
  });
  
  // Format transaction time (using current time as placeholder since we don't store time)
  const formattedTime = format(new Date(), 'p', {
    locale: currentLocale,
  });

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{transaction.description}</CardTitle>
        <CardDescription>
          {t('transactions.details', 'Detalhes da transação')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Amount section */}
        <div className="text-center py-4">
          <TransactionAmountCell amount={transaction.amount} type={transaction.type} className="text-3xl font-bold" />
        </div>
        
        <Separator />
        
        {/* Transaction metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {t('transactions.category', 'Categoria')}
            </div>
            <TransactionCategoryCell category={transaction.category} className="text-sm" />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {t('transactions.type', 'Tipo')}
            </div>
            <TransactionTypeCell type={transaction.type} />
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {t('transactions.date', 'Data')}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {t('transactions.time', 'Hora')}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Transaction ID */}
        <div className="pt-2">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0" />
            <div>
              <p>{t('transactions.idLabel', 'ID da Transação')}: {transaction.id}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
