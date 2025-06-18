
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

interface SimplePlanningCategoryData {
  id: string;
  displayName: string;
  monthlyValue: number; // Valor mensal único
}

interface SimplePlanningData {
  year: number;
  revenue: SimplePlanningCategoryData[];
  essentialExpenses: SimplePlanningCategoryData[];
  nonEssentialExpenses: SimplePlanningCategoryData[];
  reserves: SimplePlanningCategoryData[];
}

interface MonthlyTotals {
  revenue: number;
  essential: number;
  nonEssential: number;
  reserves: number;
  surplus: number;
}

const initializeDetailedPlanningData = (year: number, realData: any): PlanningData => {
  return {
    year,
    revenue: realData.revenue.map((cat: any) => ({
      id: cat.id,
      displayName: cat.displayName,
      values: Array(12).fill(0)
    })),
    essentialExpenses: realData.essentialExpenses.map((cat: any) => ({
      id: cat.id,
      displayName: cat.displayName,
      values: Array(12).fill(0)
    })),
    nonEssentialExpenses: realData.nonEssentialExpenses.map((cat: any) => ({
      id: cat.id,
      displayName: cat.displayName,
      values: Array(12).fill(0)
    })),
    reserves: realData.reserves.map((cat: any) => ({
      id: cat.id,
      displayName: cat.displayName,
      values: Array(12).fill(0)
    }))
  };
};

const initializeSimplePlanningData = (year: number, realData: any): SimplePlanningData => {
  return {
    year,
    revenue: realData.revenue.map((cat: any) => ({
      id: cat.id,
      displayName: cat.displayName,
      monthlyValue: 0
    })),
    essentialExpenses: realData.essentialExpenses.map((cat: any) => ({
      id: cat.id,
      displayName: cat.displayName,
      monthlyValue: 0
    })),
    nonEssentialExpenses: realData.nonEssentialExpenses.map((cat: any) => ({
      id: cat.id,
      displayName: cat.displayName,
      monthlyValue: 0
    })),
    reserves: realData.reserves.map((cat: any) => ({
      id: cat.id,
      displayName: cat.displayName,
      monthlyValue: 0
    }))
  };
};

export const useUnifiedMonthlySummary = (year: number) => {
  const { 
    data: realData, 
    updateCategoryValue: updateRealValue, 
    updateCategoryName: updateRealName,
    addCategory: addRealCategory,
    removeCategory: removeRealCategory,
    reorderCategories: reorderRealCategories,
    totals: realTotals 
  } = useEditableMonthlySummary(year);

  // Estado para dados de planejamento detalhado
  const [detailedPlanningData, setDetailedPlanningData] = useState<PlanningData>(() => {
    const stored = localStorage.getItem(`detailedPlanningData_${year}`);
    if (stored) {
      const parsedData = JSON.parse(stored);
      // Ensure year matches
      if (parsedData.year === year) {
        return parsedData;
      }
    }
    return initializeDetailedPlanningData(year, realData);
  });

  // Estado para dados de planejamento simples
  const [simplePlanningData, setSimplePlanningData] = useState<SimplePlanningData>(() => {
    const stored = localStorage.getItem(`simplePlanningData_${year}`);
    if (stored) {
      const parsedData = JSON.parse(stored);
      // Ensure year matches
      if (parsedData.year === year) {
        return parsedData;
      }
    }
    return initializeSimplePlanningData(year, realData);
  });

  // Reset data when year changes
  useEffect(() => {
    console.log('Year changed to:', year);
    
    // Load detailed planning data for the new year
    const storedDetailed = localStorage.getItem(`detailedPlanningData_${year}`);
    if (storedDetailed) {
      const parsedDetailed = JSON.parse(storedDetailed);
      if (parsedDetailed.year === year) {
        setDetailedPlanningData(parsedDetailed);
      } else {
        setDetailedPlanningData(initializeDetailedPlanningData(year, realData));
      }
    } else {
      setDetailedPlanningData(initializeDetailedPlanningData(year, realData));
    }

    // Load simple planning data for the new year
    const storedSimple = localStorage.getItem(`simplePlanningData_${year}`);
    if (storedSimple) {
      const parsedSimple = JSON.parse(storedSimple);
      if (parsedSimple.year === year) {
        setSimplePlanningData(parsedSimple);
      } else {
        setSimplePlanningData(initializeSimplePlanningData(year, realData));
      }
    } else {
      setSimplePlanningData(initializeSimplePlanningData(year, realData));
    }
  }, [year, realData]);

  // Sincronizar categorias do planejamento detalhado com dados reais
  useEffect(() => {
    setDetailedPlanningData(prev => {
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
        year,
        revenue: syncSection(realData.revenue, prev.revenue),
        essentialExpenses: syncSection(realData.essentialExpenses, prev.essentialExpenses),
        nonEssentialExpenses: syncSection(realData.nonEssentialExpenses, prev.nonEssentialExpenses),
        reserves: syncSection(realData.reserves, prev.reserves)
      };

      return updated;
    });
  }, [realData, year]);

  // Sincronizar categorias do planejamento simples com dados reais
  useEffect(() => {
    setSimplePlanningData(prev => {
      const syncSection = (
        realSection: typeof realData.revenue,
        planningSection: SimplePlanningCategoryData[]
      ): SimplePlanningCategoryData[] => {
        const synced = realSection.map(realCat => {
          const existing = planningSection.find(p => p.id === realCat.id);
          return {
            id: realCat.id,
            displayName: realCat.displayName,
            monthlyValue: existing?.monthlyValue || 0
          };
        });
        return synced;
      };

      const updated = {
        ...prev,
        year,
        revenue: syncSection(realData.revenue, prev.revenue),
        essentialExpenses: syncSection(realData.essentialExpenses, prev.essentialExpenses),
        nonEssentialExpenses: syncSection(realData.nonEssentialExpenses, prev.nonEssentialExpenses),
        reserves: syncSection(realData.reserves, prev.reserves)
      };

      return updated;
    });
  }, [realData, year]);

  // Salvar dados de planejamento detalhado no localStorage
  useEffect(() => {
    localStorage.setItem(`detailedPlanningData_${year}`, JSON.stringify(detailedPlanningData));
  }, [detailedPlanningData, year]);

  // Salvar dados de planejamento simples no localStorage
  useEffect(() => {
    localStorage.setItem(`simplePlanningData_${year}`, JSON.stringify(simplePlanningData));
  }, [simplePlanningData, year]);

  const updateDetailedPlanningValue = (
    section: keyof Omit<PlanningData, 'year'>,
    categoryId: string,
    monthIndex: number,
    value: number
  ) => {
    setDetailedPlanningData(prev => ({
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

  const updateSimplePlanningValue = (
    section: keyof Omit<SimplePlanningData, 'year'>,
    categoryId: string,
    monthlyValue: number
  ) => {
    setSimplePlanningData(prev => ({
      ...prev,
      [section]: prev[section].map(category =>
        category.id === categoryId
          ? { ...category, monthlyValue }
          : category
      )
    }));
  };

  // Calcular totais do planejamento detalhado
  const detailedPlanningTotals: MonthlyTotals[] = useMemo(() => {
    return Array(12).fill(null).map((_, monthIndex) => {
      const revenue = detailedPlanningData.revenue.reduce((sum, cat) => sum + (cat.values[monthIndex] || 0), 0);
      const essential = detailedPlanningData.essentialExpenses.reduce((sum, cat) => sum + (cat.values[monthIndex] || 0), 0);
      const nonEssential = detailedPlanningData.nonEssentialExpenses.reduce((sum, cat) => sum + (cat.values[monthIndex] || 0), 0);
      const reserves = detailedPlanningData.reserves.reduce((sum, cat) => sum + (cat.values[monthIndex] || 0), 0);
      const surplus = revenue - essential - nonEssential - reserves;

      return {
        revenue,
        essential,
        nonEssential,
        reserves,
        surplus
      };
    });
  }, [detailedPlanningData]);

  // Calcular totais do planejamento simples
  const simplePlanningTotals: MonthlyTotals[] = useMemo(() => {
    return Array(12).fill(null).map(() => {
      const revenue = simplePlanningData.revenue.reduce((sum, cat) => sum + (cat.monthlyValue || 0), 0);
      const essential = simplePlanningData.essentialExpenses.reduce((sum, cat) => sum + (cat.monthlyValue || 0), 0);
      const nonEssential = simplePlanningData.nonEssentialExpenses.reduce((sum, cat) => sum + (cat.monthlyValue || 0), 0);
      const reserves = simplePlanningData.reserves.reduce((sum, cat) => sum + (cat.monthlyValue || 0), 0);
      const surplus = revenue - essential - nonEssential - reserves;

      return {
        revenue,
        essential,
        nonEssential,
        reserves,
        surplus
      };
    });
  }, [simplePlanningData]);

  return {
    // Dados reais
    realData,
    updateRealValue,
    updateRealName,
    addRealCategory,
    removeRealCategory,
    reorderRealCategories,
    realTotals,
    
    // Dados de planejamento detalhado
    planningData: detailedPlanningData,
    updatePlanningValue: updateDetailedPlanningValue,
    planningTotals: detailedPlanningTotals,
    
    // Dados de planejamento simples
    simplePlanningData,
    updateSimplePlanningValue,
    simplePlanningTotals,
    
    // Métodos unificados
    year
  };
};
