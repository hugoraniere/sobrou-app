
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import IngredientsList from './ingredients/IngredientsList';

interface IngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IngredientDialog: React.FC<IngredientDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ingrediente</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Card className="p-4">
            <IngredientsList />
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientDialog;
