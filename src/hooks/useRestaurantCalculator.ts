
import { useState, useEffect } from 'react';
import { Dish, DishIngredient, Ingredient, CostCalculation } from '@/types/restaurant-calculator';
import { toast } from 'sonner';
import { 
  createDish, 
  updateDish, 
  getDishById, 
  getDishIngredients, 
  addDishIngredient, 
  updateDishIngredient,
  removeDishIngredient,
} from '@/services/restaurant-calculator/dishService';
import { calculateDishCost } from '@/utils/calculationUtils';

export enum DishFormStep {
  DETAILS = 'details',
  INGREDIENTS = 'ingredients',
  CALCULATION = 'calculation',
}

export const useRestaurantCalculator = () => {
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
  
  return {
    currentTab,
    setCurrentTab,
    isDishFormOpen,
    setIsDishFormOpen,
    dishFormStep,
    setDishFormStep,
    selectedDish,
    setSelectedDish,
    dishIngredients,
    isLoading,
    calculation,
    isIngredientDialogOpen,
    setIsIngredientDialogOpen,
    isDuplicating,
    handleCreateDish,
    handleEditDish,
    handleDuplicateDish,
    handleCalculateDish,
    handleDishFormSubmit,
    handleAddDishIngredient,
    handleUpdateDishIngredient,
    handleRemoveDishIngredient,
    handleFinishIngredientsStep,
  };
};
