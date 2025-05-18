
import { supabase } from '@/integrations/supabase/client';
import { Dish, DishIngredient } from '@/types/restaurant-calculator';
import { toast } from 'sonner';

export async function getDishes(): Promise<Dish[]> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching dishes:', error);
    toast.error('Erro ao carregar pratos');
    return [];
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
    console.error('Error fetching dish:', error);
    toast.error('Erro ao carregar o prato');
    return null;
  }
}

export async function createDish(dish: Omit<Dish, 'id'>): Promise<Dish | null> {
  try {
    const { data, error } = await supabase
      .from('dishes')
      .insert(dish)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Prato criado com sucesso');
    return data;
  } catch (error) {
    console.error('Error creating dish:', error);
    toast.error('Erro ao criar prato');
    return null;
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
    console.error('Error updating dish:', error);
    toast.error('Erro ao atualizar prato');
    return null;
  }
}

export async function deleteDish(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Prato removido com sucesso');
    return true;
  } catch (error) {
    console.error('Error deleting dish:', error);
    toast.error('Erro ao remover prato');
    return false;
  }
}

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
    return data || [];
  } catch (error) {
    console.error('Error fetching dish ingredients:', error);
    toast.error('Erro ao carregar ingredientes do prato');
    return [];
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
    console.error('Error adding dish ingredient:', error);
    toast.error('Erro ao adicionar ingrediente ao prato');
    return null;
  }
}

export async function updateDishIngredient(id: string, quantity: number): Promise<DishIngredient | null> {
  try {
    const { data, error } = await supabase
      .from('dish_ingredients')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating dish ingredient:', error);
    toast.error('Erro ao atualizar ingrediente do prato');
    return null;
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
    console.error('Error removing dish ingredient:', error);
    toast.error('Erro ao remover ingrediente do prato');
    return false;
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
    console.error('Error removing dish ingredients:', error);
    toast.error('Erro ao remover ingredientes do prato');
    return false;
  }
}
