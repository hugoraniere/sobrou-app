import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/useResponsive';
import { BillsList } from '@/components/bills/BillsList';
import { BillBalanceCard } from '@/components/bills/BillBalanceCard';
import { BillsPeriodFilters, BillsPeriodFilter } from '@/components/bills/BillsPeriodFilters';
import { BillsSearchAndToggle } from '@/components/bills/BillsSearchAndToggle';
import { AddBillDialog } from '@/components/bills/AddBillDialog';
import { useBillsData } from '@/hooks/useBillsData';
import { useBillFilters } from '@/hooks/useBillFilters';
import { Bill } from '@/types/bills';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';
import { notificationsService } from '@/services/notificationsService';
const BillsToPay = () => {
  const {
    t
  } = useTranslation();
  const {
    isMobile
  } = useResponsive();
  const {
    bills,
    isLoading,
    error,
    createBill,
    updateBill,
    deleteBill,
    markAsPaid,
    markAsUnpaid,
    isCreating,
    isUpdating
  } = useBillsData();

  // Estados para controlar o dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [notificationPreferences, setNotificationPreferences] = useState({
    bill_due: true
  });

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState<BillsPeriodFilter>('this-month');
  const [customMonth, setCustomMonth] = useState(new Date().toISOString().slice(0, 7));
  const [hidePaid, setHidePaid] = useState(false);

  // Aplicar filtros
  const {
    filteredBills,
    billMetrics
  } = useBillFilters(bills || [], {
    searchTerm,
    periodFilter,
    customMonth,
    hidePaid
  });

  // Create notifications for bills due today
  useEffect(() => {
    const createBillNotifications = async () => {
      if (!bills || !notificationPreferences.bill_due) return;
      const today = new Date().toISOString().split('T')[0];
      const billsDueToday = bills.filter(bill => !bill.is_paid && bill.due_date === today);
      for (const bill of billsDueToday) {
        try {
          await notificationsService.createBillDueNotificationIfNeeded(bill);
        } catch (error) {
          console.error('Error creating bill notification:', error);
        }
      }
    };
    createBillNotifications();
  }, [bills, notificationPreferences.bill_due]);

  // Load notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await notificationsService.getPreferences();
        setNotificationPreferences(prefs);
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    };
    loadPreferences();
  }, []);
  const handleRefetch = () => {
    // As mutations do useBillsData já invalidam automaticamente as queries
    // então não precisamos de uma função refetch explícita
  };
  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setIsAddDialogOpen(true);
  };
  const handleCreateBill = (data: any) => {
    if (editingBill) {
      updateBill(editingBill.id, data);
    } else {
      createBill(data);
    }
    setIsAddDialogOpen(false);
    setEditingBill(null);
  };
  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditingBill(null);
  };
  if (isLoading) {
    return <ResponsivePageContainer>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando contas...</p>
          </div>
        </div>
      </ResponsivePageContainer>;
  }
  if (error) {
    return <ResponsivePageContainer>
        <div className="text-center py-8">
          <p className="text-destructive mb-4">Erro ao carregar contas: {error.message}</p>
          <button onClick={handleRefetch} className="text-primary hover:underline">
            Tentar novamente
          </button>
        </div>
      </ResponsivePageContainer>;
  }

  // Usar contagem de contas pagas filtrada por período
  const paidBillsCount = billMetrics.paidBillsCount;
  return <ResponsivePageContainer>
      <ResponsivePageHeader title={t('bills.title', 'Contas a Pagar')} description="Gerencie suas contas e acompanhe os pagamentos">
        {isMobile ? <Button onClick={() => setIsAddDialogOpen(true)} size="icon" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button> : <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Conta
          </Button>}
      </ResponsivePageHeader>

      <div className="space-y-4">
        {/* 1. Filtros de período */}
        <BillsPeriodFilters 
          periodFilter={periodFilter} 
          onPeriodFilterChange={setPeriodFilter} 
          customMonth={customMonth} 
          onCustomMonthChange={setCustomMonth} 
        />

        {/* 2. Big numbers */}
        <BillBalanceCard 
          unpaidBillsCount={billMetrics.unpaidBillsCount} 
          paidBillsCount={billMetrics.paidBillsCount} 
          totalAmountToPay={billMetrics.totalAmountToPay} 
          totalAmountPaid={billMetrics.totalAmountPaid} 
        />

        {/* 3. Busca + toggle (com espaçamento maior) */}
        <div className="pt-2">
          <BillsSearchAndToggle 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            hidePaid={hidePaid} 
            onHidePaidChange={setHidePaid} 
            paidCount={paidBillsCount} 
          />
        </div>

        {/* 4. Lista de contas */}
        <BillsList 
          bills={filteredBills} 
          onEdit={handleEditBill} 
          onDelete={deleteBill} 
          onTogglePaid={(id, isPaid) => isPaid ? markAsPaid(id) : markAsUnpaid(id)} 
        />
      </div>

      <AddBillDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSubmit={handleCreateBill} editingBill={editingBill} isSubmitting={isCreating || isUpdating} />
    </ResponsivePageContainer>;
};
export default BillsToPay;