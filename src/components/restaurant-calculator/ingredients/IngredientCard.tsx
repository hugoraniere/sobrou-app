
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/calculationUtils';
import { Ingredient } from '@/types/restaurant-calculator';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onEdit, onDelete }) => {
  const { id, name, unit, price, waste_percentage } = ingredient;

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'g': return 'grama';
      case 'kg': return 'quilograma';
      case 'ml': return 'mililitro';
      case 'L': return 'litro';
      case 'un': return 'unidade';
      default: return unit;
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium">{name}</h3>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>Preço: {formatCurrency(price)} / {getUnitLabel(unit)}</p>
          <p>Merma: {formatPercentage(waste_percentage)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => onEdit(ingredient)}>
          <Pencil size={16} className="mr-1" /> Editar
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
              <Trash2 size={16} className="mr-1" /> Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o ingrediente "{name}"? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(id)} className="bg-red-500 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default IngredientCard;
