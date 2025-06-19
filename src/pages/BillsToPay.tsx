
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddBillDialog } from '@/components/bills/AddBillDialog';
import { BillsList } from '@/components/bills/BillsList';
import { BillFilters } from '@/components/bills/BillFilters';
import { useBillsData } from '@/hooks/useBillsData';
import { useBillFilters } from '@/hooks/useBillFilters';
import { CreateBillData, Bill, BillPeriodFilter } from '@/types/bills';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const BillsToPay: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [activeFilter, setActiveFilter] = useState<BillPeriodFilter>('all');

  const {
    bills,
    isLoading,
    createBill,
    updateBill,
    deleteBill,
    markAsPaid,
    markAsUnpaid,
    isCreating,
    isUpdating,
  } = useBillsData();

  // Usar o hook de filtros para as contas não pagas
  const unpaidBills = bills.filter(bill => !bill.is_paid);
  const { filteredBills, billCounts } = useBillFilters(unpaidBills, activeFilter);
  const paidBills = bills.filter(bill => bill.is_paid);

  const handleAddBill = () => {
    setEditingBill(null);
    setIsDialogOpen(true);
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: CreateBillData) => {
    if (editingBill) {
      updateBill(editingBill.id, data);
    } else {
      createBill(data);
    }
    setIsDialogOpen(false);
    setEditingBill(null);
  };

  const handleDeleteBill = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      deleteBill(id);
    }
  };

  const handleTogglePaid = (id: string, isPaid: boolean) => {
    if (isPaid) {
      markAsPaid(id);
    } else {
      markAsUnpaid(id);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingBill(null);
    }
  };

  const handleFilterChange = (filter: BillPeriodFilter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contas a Pagar</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe suas contas futuras e evite atrasos.
          </p>
        </div>
        <Button onClick={handleAddBill} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Nova conta
        </Button>
      </div>

      {/* Statistics */}
      {!isLoading && bills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{unpaidBills.length}</div>
              <div className="text-sm text-gray-600">Contas em aberto</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{paidBills.length}</div>
              <div className="text-sm text-gray-600">Contas pagas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{bills.length}</div>
              <div className="text-sm text-gray-600">Total de contas</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contas em aberto */}
      {!isLoading && unpaidBills.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Contas em Aberto</h2>
            <BillFilters
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              counts={billCounts}
            />
          </div>
          <BillsList
            bills={filteredBills}
            onEdit={handleEditBill}
            onDelete={handleDeleteBill}
            onTogglePaid={handleTogglePaid}
          />
        </div>
      )}

      {/* Contas pagas */}
      {!isLoading && paidBills.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Contas Pagas</h2>
          <BillsList
            bills={paidBills}
            onEdit={handleEditBill}
            onDelete={handleDeleteBill}
            onTogglePaid={handleTogglePaid}
          />
        </div>
      )}

      {/* Lista geral quando não há separação */}
      {!isLoading && bills.length > 0 && unpaidBills.length === 0 && paidBills.length === 0 && (
        <BillsList
          bills={bills}
          onEdit={handleEditBill}
          onDelete={handleDeleteBill}
          onTogglePaid={handleTogglePaid}
        />
      )}

      {/* Lista vazia ou loading */}
      {(isLoading || bills.length === 0) && (
        <BillsList
          bills={bills}
          onEdit={handleEditBill}
          onDelete={handleDeleteBill}
          onTogglePaid={handleTogglePaid}
          isLoading={isLoading}
        />
      )}

      {/* Dialog */}
      <AddBillDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={handleSubmit}
        editingBill={editingBill}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
};

export default BillsToPay;
