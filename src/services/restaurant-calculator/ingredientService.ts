
import { supabase } from '@/integrations/supabase/client';
import { Ingredient, Unit } from '@/types/restaurant-calculator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export async function getIngredients(): Promise<Ingredient[]> {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Converter o tipo unit para o tipo Unit
    const typedData = data?.map(item => ({
      ...item,
      unit: item.unit as Unit
    })) || [];
    
    return typedData;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    toast.error('Erro ao carregar ingredientes');
    return [];
  }
}

export async function getIngredientById(id: string): Promise<Ingredient | null> {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        ...data,
        unit: data.unit as Unit
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    toast.error('Erro ao carregar o ingrediente');
    return null;
  }
}

export async function createIngredient(ingredientData: Omit<Ingredient, 'id'>): Promise<Ingredient | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error('Usuário não autenticado');
      return null;
    }
    
    // Incluir o user_id no objeto
    const ingredient = {
      ...ingredientData,
      user_id: userData.user.id
    };
    
    const { data, error } = await supabase
      .from('ingredients')
      .insert(ingredient)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Ingrediente adicionado com sucesso');
    return data ? {...data, unit: data.unit as Unit} : null;
  } catch (error) {
    console.error('Error creating ingredient:', error);
    toast.error('Erro ao criar ingrediente');
    return null;
  }
}

export async function updateIngredient(id: string, ingredientData: Partial<Ingredient>): Promise<Ingredient | null> {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .update(ingredientData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Ingrediente atualizado com sucesso');
    return data ? {...data, unit: data.unit as Unit} : null;
  } catch (error) {
    console.error('Error updating ingredient:', error);
    toast.error('Erro ao atualizar ingrediente');
    return null;
  }
}

export async function deleteIngredient(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Ingrediente removido com sucesso');
    return true;
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    toast.error('Erro ao remover ingrediente');
    return false;
  }
}
