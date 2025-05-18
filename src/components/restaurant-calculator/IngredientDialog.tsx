
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import IngredientsList from './ingredients/IngredientsList';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Adicionar Novo Ingrediente</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
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
