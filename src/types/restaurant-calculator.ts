
export type Unit = 'g' | 'kg' | 'ml' | 'L' | 'un';

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  price: number;
  waste_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface Dish {
  id: string;
  name: string;
  description?: string;
  operational_cost_percentage: number;
  tax_percentage?: number;
  desired_margin_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface DishIngredient {
  id: string;
  dish_id: string;
  ingredient_id: string;
  ingredient?: Ingredient;
  quantity: number;
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
  margin: number;
}
