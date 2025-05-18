
import { CostCalculation, Dish, DishIngredient, Ingredient, Unit } from "@/types/restaurant-calculator";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Adicionando a função formatWeight que estava faltando
export const formatWeight = (weight: number, unit: Unit): string => {
  if (unit === 'g') {
    return `${weight.toFixed(1)}g`;
  } else if (unit === 'kg') {
    if (weight < 1) {
      // Converter para gramas se for menos de 1kg
      return `${(weight * 1000).toFixed(0)}g`;
    }
    return `${weight.toFixed(2)}kg`;
  } else if (unit === 'ml') {
    return `${weight.toFixed(0)}ml`;
  } else if (unit === 'L') {
    if (weight < 1) {
      // Converter para mililitros se for menos de 1L
      return `${(weight * 1000).toFixed(0)}ml`;
    }
    return `${weight.toFixed(2)}L`;
  } else {
    // Para unidades (un)
    return `${weight.toFixed(0)} ${unit}`;
  }
};

export const calculateDishCost = (
  dish: Dish, 
  dishIngredients: (DishIngredient & { ingredient: Ingredient })[]
): CostCalculation => {
  const ingredientCosts = dishIngredients.map(item => {
    const { ingredient, quantity } = item;
    const grossWeight = quantity;
    const netWeight = quantity * (1 - ingredient.waste_percentage / 100);
    const cost = (netWeight / (1 - ingredient.waste_percentage / 100)) * ingredient.price;
    
    return {
      ingredient,
      gross_weight: grossWeight,
      net_weight: netWeight,
      cost
    };
  });
  
  const totalIngredientsCost = ingredientCosts.reduce((sum, item) => sum + item.cost, 0);
  
  const operationalCost = totalIngredientsCost * (dish.operational_cost_percentage / 100);
  
  const taxPercentage = dish.tax_percentage || 0;
  const taxCost = totalIngredientsCost * (taxPercentage / 100);
  
  const totalCost = totalIngredientsCost + operationalCost + taxCost;
  
  // Calcular preço sugerido com base na margem desejada
  // Fórmula: preço = custo / (1 - margem)
  const marginDecimal = dish.desired_margin_percentage / 100;
  const suggestedPrice = totalCost / (1 - marginDecimal);
  
  // Calcular margem em valor
  const margin = suggestedPrice - totalCost;
  
  // Se tiver um preço de venda definido, calcular o percentual de margem
  let marginPercentage;
  if (dish.selling_price) {
    marginPercentage = ((dish.selling_price - totalCost) / dish.selling_price) * 100;
  }
  
  return {
    ingredients: ingredientCosts,
    total_ingredients_cost: totalIngredientsCost,
    operational_cost: operationalCost,
    tax_cost: taxCost,
    total_cost: totalCost,
    suggested_price: suggestedPrice,
    desired_selling_price: dish.selling_price,
    margin,
    margin_percentage: marginPercentage
  };
};
