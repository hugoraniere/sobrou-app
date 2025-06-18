
import { useState, useEffect, useMemo } from 'react';
import { useEditableMonthlySummary } from './useEditableMonthlySummary';

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

export const useUnifiedMonthlySummary = (year: number) => {
  const { 
    data: realData, 
    updateCategoryValue: updateRealValue, 
    updateCategoryName: updateRealName,
    addCategory: addRealCategory,
    totals: realTotals 
  } = useEditableMonthlySummary(year);

  // Estado para dados de planejamento
  const [planningData, setPlanningData] = useState<PlanningData>(() => {
    const stored = localStorage.getItem(`planningData_${year}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Inicializar com base nas categorias reais
    return {
      year,
      revenue: realData.revenue.map(cat => ({
        id: cat.id,
        displayName: cat.displayName,
        values: Array(12).fill(0)
      })),
      essentialExpenses: realData.essentialExpenses.map(cat => ({
        id: cat.id,
        displayName: cat.displayName,
        values: Array(12).fill(0)
      })),
      nonEssentialExpenses: realData.nonEssentialExpenses.map(cat => ({
        id: cat.id,
        displayName: cat.displayName,
        values: Array(12).fill(0)
      })),
      reserves: realData.reserves.map(cat => ({
        id: cat.id,
        displayName: cat.displayName,
        values: Array(12).fill(0)
      }))
    };
  });

  // Sincronizar categorias do planejamento com dados reais
  useEffect(() => {
    setPlanningData(prev => {
      const syncSection = (
        realSection: typeof realData.revenue,
        planningSection: PlanningCategoryData[]
      ): PlanningCategoryData[] => {
        const synced = realSection.map(realCat => {
          const existing = planningSection.find(p => p.id === realCat.id);
          return {
            id: realCat.id,
            displayName: realCat.displayName,
            values: existing?.values || Array(12).fill(0)
          };
        });
        return synced;
      };

      const updated = {
        ...prev,
        revenue: syncSection(realData.revenue, prev.revenue),
        essentialExpenses: syncSection(realData.essentialExpenses, prev.essentialExpenses),
        nonEssentialExpenses: syncSection(realData.nonEssentialExpenses, prev.nonEssentialExpenses),
        reserves: syncSection(realData.reserves, prev.reserves)
      };

      return updated;
    });
  }, [realData]);

  // Salvar dados de planejamento no localStorage
  useEffect(() => {
    localStorage.setItem(`planningData_${year}`, JSON.stringify(planningData));
  }, [planningData, year]);

  const updatePlanningValue = (
    section: keyof Omit<PlanningData, 'year'>,
    categoryId: string,
    monthIndex: number,
    value: number
  ) => {
    setPlanningData(prev => ({
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

  // Calcular totais do planejamento
  const planningTotals: MonthlyTotals[] = useMemo(() => {
    return Array(12).fill(null).map((_, monthIndex) => {
      const revenue = planningData.revenue.reduce((sum, cat) => sum + (cat.values[monthIndex] || 0), 0);
      const essential = planningData.essentialExpenses.reduce((sum, cat) => sum + (cat.values[monthIndex] || 0), 0);
      const nonEssential = planningData.nonEssentialExpenses.reduce((sum, cat) => sum + (cat.values[monthIndex] || 0), 0);
      const reserves = planningData.reserves.reduce((sum, cat) => sum + (cat.values[monthIndex] || 0), 0);
      const surplus = revenue - essential - nonEssential - reserves;

      return {
        revenue,
        essential,
        nonEssential,
        reserves,
        surplus
      };
    });
  }, [planningData]);

  return {
    // Dados reais
    realData,
    updateRealValue,
    updateRealName,
    addRealCategory,
    realTotals,
    
    // Dados de planejamento
    planningData,
    updatePlanningValue,
    planningTotals,
    
    // Métodos unificados
    year
  };
};
