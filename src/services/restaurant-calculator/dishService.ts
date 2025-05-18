
import { supabase } from '@/integrations/supabase/client';
import { Dish, DishIngredient, Unit } from '@/types/restaurant-calculator';
import { toast } from 'sonner';

// Funções utilitárias para melhorar o reuso de código
const handleError = (error: unknown, errorMessage: string): null => {
  console.error(`${errorMessage}:`, error);
  toast.error(errorMessage);
  return null;
};

const getCurrentUser = async () => {
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) {
    toast.error('Usuário não autenticado');
    return null;
  }
  return userData.user;
};

const convertUnitType = <T extends { unit?: string }>(item: T): T & { unit: Unit } => {
  return {
    ...item,
    unit: item.unit as Unit
  };
};

// Seção 1: Funções relacionadas a pratos
export async function getDishes(): Promise<Dish[]> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleError(error, 'Erro ao carregar pratos') as Dish[];
  }
}

export async function getDishById(id: string): Promise<Dish | null> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao carregar o prato');
  }
}

export async function createDish(dishData: Omit<Dish, 'id'>): Promise<Dish | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const dish = {
      ...dishData,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('dishes')
      .insert(dish)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Prato criado com sucesso');
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao criar prato');
  }
}

export async function updateDish(id: string, dish: Partial<Dish>): Promise<Dish | null> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .update(dish)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Prato atualizado com sucesso');
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao atualizar prato');
  }
}

export async function deleteDish(id: string): Promise<boolean> {
  try {
    // Primeiro remove todos os ingredientes relacionados ao prato
    const deleteIngredientsResult = await removeDishIngredients(id);
    if (!deleteIngredientsResult) {
      throw new Error('Falha ao remover ingredientes do prato');
    }
    
    // Depois remove o prato
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Prato removido com sucesso');
    return true;
  } catch (error) {
    return handleError(error, 'Erro ao remover prato') as boolean;
  }
}

// Seção 2: Funções relacionadas aos ingredientes de pratos
export async function getDishIngredients(dishId: string): Promise<DishIngredient[]> {
  try {
    const { data, error } = await supabase
      .from('dish_ingredients')
      .select(`
        *,
        ingredient:ingredient_id (*)
      `)
      .eq('dish_id', dishId);
    
    if (error) throw error;
    
    // Converter o tipo unit para o tipo Unit em cada ingrediente
    const typedData = data?.map(item => ({
      ...item,
      ingredient: item.ingredient ? convertUnitType(item.ingredient) : undefined
    })) || [];
    
    return typedData;
  } catch (error) {
    return handleError(error, 'Erro ao carregar ingredientes do prato') as DishIngredient[];
  }
}

export async function addDishIngredient(dishIngredient: Omit<DishIngredient, 'id' | 'ingredient'>): Promise<DishIngredient | null> {
  try {
    const { data, error } = await supabase
      .from('dish_ingredients')
      .insert(dishIngredient)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao adicionar ingrediente ao prato');
  }
}

export async function updateDishIngredient(id: string, quantity: number, use_percentage?: boolean): Promise<DishIngredient | null> {
  try {
    const updateData = use_percentage !== undefined 
      ? { quantity, use_percentage } 
      : { quantity };
      
    const { data, error } = await supabase
      .from('dish_ingredients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleError(error, 'Erro ao atualizar ingrediente do prato');
  }
}

export async function removeDishIngredient(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dish_ingredients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    return handleError(error, 'Erro ao remover ingrediente do prato') as boolean;
  }
}

export async function removeDishIngredients(dishId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dish_ingredients')
      .delete()
      .eq('dish_id', dishId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    return handleError(error, 'Erro ao remover ingredientes do prato') as boolean;
  }
}
