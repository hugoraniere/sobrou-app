
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExtractedTransaction } from '@/services/bankStatementService';
import { ConfirmTransactionsDialog } from '../upload/ConfirmTransactionsDialog';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extractedTransactions: ExtractedTransaction[];
  onImport: () => Promise<void>;
  onToggleSelection: (index: number) => void;
  onSelectAll: (selected: boolean) => void;
  onUpdateCategory: (index: number, category: string) => void;
  isProcessing: boolean;
  processingStep?: string;
}

const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onOpenChange,
  extractedTransactions,
  onImport,
  onToggleSelection,
  onSelectAll,
  onUpdateCategory,
  isProcessing,
  processingStep
}) => {
  return (
    <ConfirmTransactionsDialog
      open={open}
      onOpenChange={onOpenChange}
      transactions={extractedTransactions}
      onToggleSelection={onToggleSelection}
      onSelectAll={onSelectAll}
      onImport={onImport}
      isProcessing={isProcessing}
      onUpdateCategory={onUpdateCategory}
      processingStep={processingStep}
    />
  );
};

export default ImportDialog;
