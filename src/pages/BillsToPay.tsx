
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BillsList } from '@/components/bills/BillsList';
import { BillBalanceCard } from '@/components/bills/BillBalanceCard';
import { useBillsData } from '@/hooks/useBillsData';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const BillsToPay = () => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const { bills, isLoading, error, updateBill, deleteBill, markAsPaid, markAsUnpaid } = useBillsData();

  const handleRefetch = () => {
    // As mutations do useBillsData já invalidam automaticamente as queries
    // então não precisamos de uma função refetch explícita
  };

  const handleEditBill = (bill) => {
    // Esta função será chamada quando o usuário quiser editar uma conta
    // Por enquanto, vamos apenas logar - você pode implementar um modal de edição aqui
    console.log('Edit bill:', bill);
  };

  if (isLoading) {
    return (
      <div className={cn(
        "w-full",
        isMobile ? "px-4 py-8" : "container mx-auto max-w-screen-xl"
      )}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando contas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "w-full",
        isMobile ? "px-4 py-8" : "container mx-auto max-w-screen-xl"
      )}>
        <div className="text-center py-8">
          <p className="text-destructive mb-4">Erro ao carregar contas: {error.message}</p>
          <button onClick={handleRefetch} className="text-primary hover:underline">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Calcular valores para o BillBalanceCard
  const totalOriginalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalTransactions = 0; // Por enquanto 0, pois não temos transações implementadas
  const currentBalance = totalOriginalAmount - totalTransactions;

  return (
    <div className={cn(
      "w-full",
      isMobile ? "px-4 py-8" : "container mx-auto max-w-screen-xl"
    )}>
      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{t('bills.title', 'Contas a Pagar')}</h1>
        <p className="text-gray-600">Gerencie suas contas e acompanhe os pagamentos</p>
      </div>

      <div className="space-y-6">
        <BillBalanceCard 
          originalAmount={totalOriginalAmount}
          currentBalance={currentBalance}
          transactionsTotal={totalTransactions}
          hasTransactions={false}
        />
        <BillsList 
          bills={bills} 
          onEdit={handleEditBill}
          onDelete={deleteBill}
          onTogglePaid={(id, isPaid) => isPaid ? markAsPaid(id) : markAsUnpaid(id)}
        />
      </div>
    </div>
  );
};

export default BillsToPay;
