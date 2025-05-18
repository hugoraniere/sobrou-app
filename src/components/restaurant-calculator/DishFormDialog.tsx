
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { DishFormStep } from '@/hooks/useRestaurantCalculator';
import DishForm from './dishes/DishForm';
import IngredientSelector from './dishes/IngredientSelector';
import CostCalculator from './calculation/CostCalculator';
import { Dish, DishIngredient, Ingredient, CostCalculation } from '@/types/restaurant-calculator';

interface DishFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dishFormStep: DishFormStep;
  selectedDish: Dish | null;
  isDuplicating: boolean;
  dishIngredients: (DishIngredient & { ingredient: Ingredient })[];
  calculation: CostCalculation | null;
  isLoading: boolean;
  onDishFormSubmit: (data: Omit<Dish, 'id'>) => Promise<void>;
  onAddDishIngredient: (ingredientId: string, quantity: number) => Promise<void>;
  onUpdateDishIngredient: (dishIngredientId: string, quantity: number) => Promise<void>;
  onRemoveDishIngredient: (dishIngredientId: string) => Promise<void>;
  onFinishIngredientsStep: () => void;
  setDishFormStep: (step: DishFormStep) => void;
  onOpenIngredientDialog: () => void;
}

const DishFormDialog: React.FC<DishFormDialogProps> = ({
  open,
  onOpenChange,
  dishFormStep,
  selectedDish,
  isDuplicating,
  dishIngredients,
  calculation,
  isLoading,
  onDishFormSubmit,
  onAddDishIngredient,
  onUpdateDishIngredient,
  onRemoveDishIngredient,
  onFinishIngredientsStep,
  setDishFormStep,
  onOpenIngredientDialog
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {dishFormStep === DishFormStep.CALCULATION
              ? 'Cálculo de Custo do Prato'
              : selectedDish
                ? isDuplicating
                  ? 'Duplicar Prato'
                  : 'Editar Prato'
                : 'Novo Prato'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {dishFormStep === DishFormStep.DETAILS && (
            <DishForm
              dish={selectedDish || undefined}
              onSubmit={onDishFormSubmit}
              isLoading={isLoading}
              onCancel={() => onOpenChange(false)}
            />
          )}

          {dishFormStep === DishFormStep.INGREDIENTS && selectedDish && (
            <div className="space-y-6">
              <IngredientSelector
                dishIngredients={dishIngredients}
                onAddIngredient={onAddDishIngredient}
                onUpdateQuantity={onUpdateDishIngredient}
                onRemoveIngredient={onRemoveDishIngredient}
                onAddNewClick={onOpenIngredientDialog}
              />

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setDishFormStep(DishFormStep.DETAILS)}
                >
                  <ArrowLeft size={16} className="mr-1" /> Voltar
                </Button>
                <Button 
                  onClick={onFinishIngredientsStep} 
                  disabled={dishIngredients.length === 0}
                >
                  Calcular Custos
                </Button>
              </div>
            </div>
          )}

          {dishFormStep === DishFormStep.CALCULATION && calculation && selectedDish && (
            <div className="space-y-6">
              <CostCalculator calculation={calculation} />
              
              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setDishFormStep(DishFormStep.INGREDIENTS)}
                >
                  <ArrowLeft size={16} className="mr-1" /> Editar Ingredientes
                </Button>
                <Button 
                  onClick={() => onOpenChange(false)}
                >
                  <Save size={16} className="mr-1" /> Concluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DishFormDialog;
