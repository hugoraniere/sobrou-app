
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Copy, Calculator } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/calculationUtils';
import { Dish } from '@/types/restaurant-calculator';
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
import { Badge } from '@/components/ui/badge';

interface DishCardProps {
  dish: Dish;
  ingredientCount: number;
  onEdit: (dish: Dish) => void;
  onDelete: (id: string) => void;
  onDuplicate: (dish: Dish) => void;
  onCalculate: (dish: Dish) => void;
}

const DishCard: React.FC<DishCardProps> = ({
  dish,
  ingredientCount,
  onEdit,
  onDelete,
  onDuplicate,
  onCalculate
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{dish.name}</h3>
          <Badge variant="outline">
            {ingredientCount} {ingredientCount === 1 ? 'ingrediente' : 'ingredientes'}
          </Badge>
        </div>
        
        {dish.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{dish.description}</p>
        )}
        
        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Custo operacional:</span>
            <span>{formatPercentage(dish.operational_cost_percentage)}</span>
          </div>
          
          {dish.tax_percentage && dish.tax_percentage > 0 && (
            <div className="flex justify-between">
              <span>Impostos:</span>
              <span>{formatPercentage(dish.tax_percentage)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-medium">
            <span>Margem desejada:</span>
            <span>{formatPercentage(dish.desired_margin_percentage)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(dish)}>
          <Pencil size={16} className="mr-1" /> Editar
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => onDuplicate(dish)}>
          <Copy size={16} className="mr-1" /> Duplicar
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => onCalculate(dish)}>
          <Calculator size={16} className="mr-1" /> Calcular
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
                Tem certeza que deseja excluir o prato "{dish.name}"? 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(dish.id)} className="bg-red-500 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default DishCard;
