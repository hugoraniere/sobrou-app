import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

import IngredientsList from '@/components/restaurant-calculator/ingredients/IngredientsList';
import DishesList from '@/components/restaurant-calculator/dishes/DishesList';
import DishForm from '@/components/restaurant-calculator/dishes/DishForm';
import IngredientSelector from '@/components/restaurant-calculator/dishes/IngredientSelector';
import CostCalculator from '@/components/restaurant-calculator/calculation/CostCalculator';
import { CostCalculation, Dish, DishIngredient, Ingredient } from '@/types/restaurant-calculator';
import { 
  createDish, 
  updateDish, 
  getDishById, 
  deleteDish, 
  getDishIngredients, 
  addDishIngredient, 
  updateDishIngredient,
  removeDishIngredient,
  removeDishIngredients
} from '@/services/restaurant-calculator/dishService';
import { calculateDishCost } from '@/utils/calculationUtils';
import { useAuth } from '@/contexts/AuthContext';

enum DishFormStep {
  DETAILS = 'details',
  INGREDIENTS = 'ingredients',
  CALCULATION = 'calculation',
}

const RestaurantCalculator: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('ingredients');
  const [isDishFormOpen, setIsDishFormOpen] = useState(false);
  const [dishFormStep, setDishFormStep] = useState<DishFormStep>(DishFormStep.DETAILS);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dishIngredients, setDishIngredients] = useState<(DishIngredient & { ingredient: Ingredient })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calculation, setCalculation] = useState<CostCalculation | null>(null);
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Reset form state when dialog closes
  useEffect(() => {
    if (!isDishFormOpen) {
      setDishFormStep(DishFormStep.DETAILS);
      if (!isDuplicating) {
        setSelectedDish(null);
      }
      setDishIngredients([]);
      setCalculation(null);
      setIsDuplicating(false);
    }
  }, [isDishFormOpen]);

  // Carregar ingredientes do prato quando um prato é selecionado
  useEffect(() => {
    const fetchDishIngredients = async () => {
      if (selectedDish) {
        setIsLoading(true);
        try {
          const ingredients = await getDishIngredients(selectedDish.id);
          setDishIngredients(ingredients as (DishIngredient & { ingredient: Ingredient })[]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDishIngredients();
  }, [selectedDish]);

  // Funções para manipulação de pratos
  const handleCreateDish = () => {
    setSelectedDish(null);
    setDishFormStep(DishFormStep.DETAILS);
    setIsDishFormOpen(true);
  };

  const handleEditDish = async (dish: Dish) => {
    setSelectedDish(dish);
    setDishFormStep(DishFormStep.DETAILS);
    setIsDishFormOpen(true);
  };

  const handleDeleteDish = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await deleteDish(id);
      if (success) {
        setCurrentTab('dishes'); // Volta para a lista de pratos
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateDish = async (dish: Dish) => {
    setIsDuplicating(true);
    
    const newDish = {
      ...dish,
      name: `Cópia de ${dish.name}`,
      id: undefined // será gerado pelo banco
    };
    
    setSelectedDish({
      ...newDish,
      id: '', // placeholder temporário
    } as Dish);
    
    setDishFormStep(DishFormStep.DETAILS);
    setIsDishFormOpen(true);
  };

  const handleCalculateDish = async (dish: Dish) => {
    setSelectedDish(dish);
    setDishFormStep(DishFormStep.CALCULATION);
    setIsDishFormOpen(true);
    
    // Carregar ingredientes e calcular
    setIsLoading(true);
    try {
      const ingredients = await getDishIngredients(dish.id);
      setDishIngredients(ingredients as (DishIngredient & { ingredient: Ingredient })[]);
      
      // Calcular custos
      if (ingredients.length > 0) {
        const calc = calculateDishCost(dish, ingredients as (DishIngredient & { ingredient: Ingredient })[]);
        setCalculation(calc);
      } else {
        toast.warning('Este prato não possui ingredientes cadastrados.');
        setCalculation(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para o formulário de pratos
  const handleDishFormSubmit = async (data: Omit<Dish, 'id'>) => {
    setIsLoading(true);
    try {
      if (selectedDish) {
        // Atualizar prato
        const updatedDish = await updateDish(selectedDish.id, data);
        if (updatedDish) {
          setSelectedDish(updatedDish);
          setDishFormStep(DishFormStep.INGREDIENTS);
        }
      } else {
        // Criar novo prato
        const newDish = await createDish(data);
        if (newDish) {
          setSelectedDish(newDish);
          setDishFormStep(DishFormStep.INGREDIENTS);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para ingredientes do prato
  const handleAddDishIngredient = async (ingredientId: string, quantity: number) => {
    if (!selectedDish) return;

    setIsLoading(true);
    try {
      const newDishIngredient = await addDishIngredient({
        dish_id: selectedDish.id,
        ingredient_id: ingredientId,
        quantity
      });
      
      if (newDishIngredient) {
        // Recarregar ingredientes para obter os dados completos
        const ingredients = await getDishIngredients(selectedDish.id);
        setDishIngredients(ingredients as (DishIngredient & { ingredient: Ingredient })[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDishIngredient = async (dishIngredientId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const updated = await updateDishIngredient(dishIngredientId, quantity);
      if (updated && selectedDish) {
        // Atualizar lista local
        const ingredients = await getDishIngredients(selectedDish.id);
        setDishIngredients(ingredients as (DishIngredient & { ingredient: Ingredient })[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDishIngredient = async (dishIngredientId: string) => {
    setIsLoading(true);
    try {
      const success = await removeDishIngredient(dishIngredientId);
      if (success && selectedDish) {
        // Atualizar lista local
        setDishIngredients(dishIngredients.filter(item => item.id !== dishIngredientId));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para finalizar o cadastro dos ingredientes
  const handleFinishIngredientsStep = () => {
    if (!selectedDish) return;
    
    if (dishIngredients.length === 0) {
      toast.warning('Adicione pelo menos um ingrediente ao prato.');
      return;
    }
    
    // Calcular custos
    const calc = calculateDishCost(selectedDish, dishIngredients);
    setCalculation(calc);
    
    // Passar para o próximo passo
    setDishFormStep(DishFormStep.CALCULATION);
  };

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-2">Login Necessário</h1>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para acessar a calculadora de gastos para restaurantes.
          </p>
          <Button asChild>
            <a href="/auth">Fazer Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Calculadora de Gastos para Restaurantes</h1>
        <p className="text-gray-600">
          Cadastre seus ingredientes, crie pratos e calcule automaticamente custos e preços.
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
          <TabsTrigger value="dishes">Pratos</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="ingredients">
            <Card className="p-6">
              <IngredientsList />
            </Card>
          </TabsContent>
          
          <TabsContent value="dishes">
            <Card className="p-6">
              <DishesList
                onCreateDish={handleCreateDish}
                onEditDish={handleEditDish}
                onDeleteDish={handleDeleteDish}
                onDuplicateDish={handleDuplicateDish}
                onCalculateDish={handleCalculateDish}
                onCreateIngredient={() => setIsIngredientDialogOpen(true)}
              />
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Modal para criação/edição de pratos */}
      <Dialog open={isDishFormOpen} onOpenChange={setIsDishFormOpen}>
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
                onSubmit={handleDishFormSubmit}
                isLoading={isLoading}
                onCancel={() => setIsDishFormOpen(false)}
              />
            )}

            {dishFormStep === DishFormStep.INGREDIENTS && selectedDish && (
              <div className="space-y-6">
                <IngredientSelector
                  dishIngredients={dishIngredients}
                  onAddIngredient={handleAddDishIngredient}
                  onUpdateQuantity={handleUpdateDishIngredient}
                  onRemoveIngredient={handleRemoveDishIngredient}
                  onAddNewClick={() => setIsIngredientDialogOpen(true)}
                />

                <div className="flex justify-between pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setDishFormStep(DishFormStep.DETAILS)}
                  >
                    <ArrowLeft size={16} className="mr-1" /> Voltar
                  </Button>
                  <Button 
                    onClick={handleFinishIngredientsStep} 
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
                    onClick={() => setIsDishFormOpen(false)}
                  >
                    <Save size={16} className="mr-1" /> Concluir
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar novo ingrediente diretamente */}
      <Dialog open={isIngredientDialogOpen} onOpenChange={setIsIngredientDialogOpen}>
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
    </div>
  );
};

export default RestaurantCalculator;
