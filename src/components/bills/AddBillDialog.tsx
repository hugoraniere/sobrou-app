import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BillForm } from './BillForm';
import { CreateBillData, Bill } from '@/types/bills';
interface AddBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateBillData) => void;
  editingBill?: Bill | null;
  isSubmitting?: boolean;
}
export const AddBillDialog: React.FC<AddBillDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingBill,
  isSubmitting
}) => {
  const handleSubmit = (data: CreateBillData) => {
    onSubmit(data);
  };
  const handleCancel = () => {
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-neutral-50">
        <DialogHeader>
          <DialogTitle>
            {editingBill ? 'Editar Conta' : 'Nova Conta a Pagar'}
          </DialogTitle>
        </DialogHeader>
        
        <BillForm onSubmit={handleSubmit} onCancel={handleCancel} initialData={editingBill || undefined} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>;
};