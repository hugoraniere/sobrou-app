
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface TransactionControlsProps {
  onClose: () => void;
  onSave: () => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

const TransactionControls: React.FC<TransactionControlsProps> = ({
  onClose,
  onSave,
  isSubmitting = false,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex justify-end gap-2", className)}>
      <Button variant="outline" onClick={onClose}>
        {t('common.cancel', 'Cancelar')}
      </Button>
      <Button onClick={onSave} disabled={isSubmitting}>
        {isSubmitting ? 
          t('common.processing', 'Processando...') : 
          t('transactions.save', 'Salvar alterações')}
      </Button>
    </div>
  );
};

export default TransactionControls;
