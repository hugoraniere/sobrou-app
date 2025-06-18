
import { useState, useEffect } from 'react';

interface PlanningCategoryData {
  id: string;
  displayName: string;
  values: number[]; // 12 valores para os 12 meses
}

interface PlanningData {
  year: number;
  revenue: PlanningCategoryData[];
  essentialExpenses: PlanningCategoryData[];
  nonEssentialExpenses: PlanningCategoryData[];
  reserves: PlanningCategoryData[];
}

interface MonthlyTotals {
  revenue: number;
  essential: number;
  nonEssential: number;
  reserves: number;
  surplus: number;
}

export const useEditablePlanning = (year: number) => {
  const [data, setData] = useState<PlanningData>({
    year,
    revenue: [
      { id: 'salary', displayName: 'Salário', values: Array(12).fill(0) },
      { id: 'freelance', displayName: 'Freelances', values: Array(12).fill(0) }
    ],
    essentialExpenses: [
      { id: 'rent', displayName: 'Aluguel', values: Array(12).fill(0) },
      { id: 'utilities', displayName: 'Conta de Luz/Água', values: Array(12).fill(0) },
      { id: 'groceries', displayName: 'Mercado', values: Array(12).fill(0) }
    ],
    nonEssentialExpenses: [
      { id: 'entertainment', displayName: 'Entretenimento', values: Array(12).fill(0) },
      { id: 'dining', displayName: 'Restaurantes', values: Array(12).fill(0) }
    ],
    reserves: [
      { id: 'emergency', displayName: 'Reserva de Emergência', values: Array(12).fill(0) },
      { id: 'investments', displayName: 'Investimentos', values: Array(12).fill(0) }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateCategoryValue = (
    section: keyof Omit<PlanningData, 'year'>,
    categoryId: string, 
    monthIndex: number, 
    value: number
  ) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(category =>
        category.id === categoryId
          ? {
              ...category,
              values: category.values.map((v, index) =>
                index === monthIndex ? value : v
              )
            }
          : category
      )
    }));
  };

  // Calcular totais por mês
  const totals: MonthlyTotals[] = Array(12).fill(null).map((_, monthIndex) => {
    const revenue = data.revenue.reduce((sum, cat) => sum + cat.values[monthIndex], 0);
    const essential = data.essentialExpenses.reduce((sum, cat) => sum + cat.values[monthIndex], 0);
    const nonEssential = data.nonEssentialExpenses.reduce((sum, cat) => sum + cat.values[monthIndex], 0);
    const reserves = data.reserves.reduce((sum, cat) => sum + cat.values[monthIndex], 0);
    const surplus = revenue - essential - nonEssential - reserves;

    return {
      revenue,
      essential,
      nonEssential,
      reserves,
      surplus
    };
  });

  return {
    data,
    updateCategoryValue,
    totals,
    isLoading
  };
};
