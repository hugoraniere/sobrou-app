
export type Unit = 'g' | 'kg' | 'ml' | 'L' | 'un';

export interface Ingredient {
  id: string;
  user_id: string;
  name: string;
  unit: Unit;
  price: number;
  waste_percentage: number;
  // Campos adicionais para o novo fluxo de cadastro
  quantity_purchased?: number;
  total_price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Dish {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  operational_cost_percentage: number;
  tax_percentage?: number;
  desired_margin_percentage: number;
  selling_price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DishIngredient {
  id: string;
  dish_id: string;
  ingredient_id: string;
  ingredient?: Ingredient;
  quantity: number;
  use_percentage?: boolean; // Para determinar se a quantidade é em unidades ou percentual
  created_at?: string;
}

export interface IngredientCost {
  ingredient: Ingredient;
  gross_weight: number;
  net_weight: number;
  cost: number;
}

export interface CostCalculation {
  ingredients: IngredientCost[];
  total_ingredients_cost: number;
  operational_cost: number;
  tax_cost: number;
  total_cost: number;
  suggested_price: number;
  desired_selling_price?: number;
  margin: number;
  margin_percentage?: number;
}
