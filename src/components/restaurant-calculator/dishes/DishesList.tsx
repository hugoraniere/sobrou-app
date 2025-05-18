
import React, { useState, useEffect } from 'react';
import { Dish, DishIngredient, Ingredient } from '@/types/restaurant-calculator';
import { getDishes, getDishIngredients } from '@/services/restaurant-calculator/dishService';
import { getIngredients } from '@/services/restaurant-calculator/ingredientService';
import DishCard from './DishCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DishListProps {
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (id: string) => void;
  onDuplicateDish: (dish: Dish) => void;
  onCalculateDish: (dish: Dish) => void;
  onCreateDish: () => void;
  onCreateIngredient?: () => void;
}

const DishesList: React.FC<DishListProps> = ({
  onEditDish,
  onDeleteDish,
  onDuplicateDish,
  onCalculateDish,
  onCreateDish,
  onCreateIngredient
}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [dishIngredientsMap, setDishIngredientsMap] = useState<Record<string, DishIngredient[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasIngredients, setHasIngredients] = useState(false);

  const fetchIngredientsAndDishes = async () => {
    setIsLoading(true);
    try {
      // Verificar se há ingredientes cadastrados
      const ingredients = await getIngredients();
      setHasIngredients(ingredients.length > 0);
      
      // Carregar pratos se houver ingredientes
      if (ingredients.length > 0) {
        const dishesData = await getDishes();
        setDishes(dishesData);
        
        // Carregar ingredientes para cada prato
        const ingredientsMap: Record<string, DishIngredient[]> = {};
        for (const dish of dishesData) {
          const dishIngredients = await getDishIngredients(dish.id);
          ingredientsMap[dish.id] = dishIngredients;
        }
        setDishIngredientsMap(ingredientsMap);
      } else {
        setDishes([]);
        setDishIngredientsMap({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredientsAndDishes();
  }, []);

  const filteredDishes = dishes.filter(
    dish => dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Pratos Cadastrados</h2>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4 w-full md:w-auto">
          {hasIngredients && (
            <>
              <div className="relative flex items-center w-full md:w-64">
                <Search className="absolute left-2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar pratos..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button onClick={onCreateDish}>
                <Plus size={16} className="mr-1" /> Novo Prato
              </Button>
            </>
          )}
        </div>
      </div>

      {!hasIngredients ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cadastre ingredientes primeiro</AlertTitle>
          <AlertDescription>
            Você precisa cadastrar ao menos um ingrediente antes de criar pratos.
          </AlertDescription>
          <Button 
            className="mt-4" 
            onClick={onCreateIngredient}
            variant="outline"
          >
            <Plus size={16} className="mr-1" /> Cadastrar Ingredientes
          </Button>
        </Alert>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} />
          ))}
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-4">Nenhum prato encontrado.</p>
          <Button onClick={onCreateDish}>
            <Plus size={16} className="mr-1" /> Criar Novo Prato
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map(dish => (
            <DishCard
              key={dish.id}
              dish={dish}
              ingredientCount={dishIngredientsMap[dish.id]?.length || 0}
              onEdit={onEditDish}
              onDelete={onDeleteDish}
              onDuplicate={onDuplicateDish}
              onCalculate={onCalculateDish}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Card = () => (
  <div className="border rounded-md p-4">
    <div className="flex justify-between items-start">
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-5 w-20" />
    </div>
    <Skeleton className="h-4 w-full mb-4" />
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

export default DishesList;
