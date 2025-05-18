
import { CostCalculation, Dish, DishIngredient, IngredientCost } from '@/types/restaurant-calculator';

/**
 * Calcula o peso líquido considerando a porcentagem de merma
 */
export function calculateNetWeight(grossWeight: number, wastePercentage: number): number {
  return grossWeight * (1 - wastePercentage / 100);
}

/**
 * Calcula o custo do ingrediente com base no peso e preço
 */
export function calculateIngredientCost(
  quantity: number, 
  price: number, 
  wastePercentage: number, 
  unit: string
): number {
  // Converter para unidade base se necessário
  let baseQuantity = quantity;
  if (unit === 'kg') baseQuantity = quantity * 1000; // Converte kg para g
  if (unit === 'L') baseQuantity = quantity * 1000;  // Converte L para ml
  
  // Calcular peso líquido considerando merma
  const netWeight = calculateNetWeight(baseQuantity, wastePercentage);
  
  // Calcular custo para unidade equivalente
  let unitPrice = price;
  if (unit === 'kg') unitPrice = price / 1000; // Converte preço por kg para preço por g
  if (unit === 'L') unitPrice = price / 1000;  // Converte preço por L para preço por ml
  
  return netWeight * unitPrice;
}

/**
 * Calcula os custos de um prato com base nos ingredientes
 */
export function calculateDishCost(
  dish: Dish,
  dishIngredients: DishIngredient[]
): CostCalculation {
  // Calcular custo de cada ingrediente
  const ingredientCosts: IngredientCost[] = dishIngredients.map(di => {
    if (!di.ingredient) {
      return {
        ingredient: {
          id: '',
          name: 'Erro: Ingrediente não encontrado',
          unit: 'g',
          price: 0,
          waste_percentage: 0
        },
        gross_weight: 0,
        net_weight: 0,
        cost: 0
      };
    }
    
    const { quantity } = di;
    const { price, waste_percentage, unit } = di.ingredient;
    const netWeight = calculateNetWeight(quantity, waste_percentage);
    const cost = calculateIngredientCost(quantity, price, waste_percentage, unit);
    
    return {
      ingredient: di.ingredient,
      gross_weight: quantity,
      net_weight: netWeight,
      cost
    };
  });
  
  // Calcular custo total dos ingredientes
  const totalIngredientsCost = ingredientCosts.reduce((sum, item) => sum + item.cost, 0);
  
  // Calcular custo operacional
  const operationalCost = totalIngredientsCost * (dish.operational_cost_percentage / 100);
  
  // Calcular custo de impostos
  const taxCost = totalIngredientsCost * ((dish.tax_percentage || 0) / 100);
  
  // Calcular custo total
  const totalCost = totalIngredientsCost + operationalCost + taxCost;
  
  // Calcular preço sugerido com margem
  const suggestedPrice = totalCost / (1 - dish.desired_margin_percentage / 100);
  
  // Calcular margem efetiva
  const margin = ((suggestedPrice - totalCost) / suggestedPrice) * 100;
  
  return {
    ingredients: ingredientCosts,
    total_ingredients_cost: totalIngredientsCost,
    operational_cost: operationalCost,
    tax_cost: taxCost,
    total_cost: totalCost,
    suggested_price: suggestedPrice,
    margin
  };
}

/**
 * Formata valor monetário para BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

/**
 * Formata peso com unidade
 */
export function formatWeight(value: number, unit: string): string {
  return `${value.toFixed(2)} ${unit}`;
}
