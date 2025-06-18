
import { useState, useEffect, useCallback } from 'react';

export interface EditableCategoryData {
  id: string;
  name: string;
  displayName: string;
  values: number[]; // 12 valores (um por mês)
}

export interface EditableMonthlySummary {
  year: number;
  revenue: EditableCategoryData[];
  essentialExpenses: EditableCategoryData[];
  nonEssentialExpenses: EditableCategoryData[];
  reserves: EditableCategoryData[];
}

const getInitialCategories = () => ({
  revenue: [
    { id: 'salario', name: 'salario', displayName: 'Salário', values: Array(12).fill(0) },
    { id: 'freelance', name: 'freelance', displayName: 'Freelance', values: Array(12).fill(0) },
    { id: 'aluguel-recebido', name: 'aluguel-recebido', displayName: 'Aluguel Recebido', values: Array(12).fill(0) },
    { id: 'investimentos', name: 'investimentos', displayName: 'Rendimentos', values: Array(12).fill(0) },
  ],
  essentialExpenses: [
    { id: 'moradia', name: 'moradia', displayName: 'Moradia', values: Array(12).fill(0) },
    { id: 'alimentacao', name: 'alimentacao', displayName: 'Alimentação', values: Array(12).fill(0) },
    { id: 'transporte', name: 'transporte', displayName: 'Transporte', values: Array(12).fill(0) },
    { id: 'saude', name: 'saude', displayName: 'Saúde', values: Array(12).fill(0) },
    { id: 'internet', name: 'internet', displayName: 'Internet', values: Array(12).fill(0) },
    { id: 'cartao', name: 'cartao', displayName: 'Cartão', values: Array(12).fill(0) },
  ],
  nonEssentialExpenses: [
    { id: 'lazer', name: 'lazer', displayName: 'Lazer', values: Array(12).fill(0) },
    { id: 'compras', name: 'compras', displayName: 'Compras', values: Array(12).fill(0) },
    { id: 'outros', name: 'outros', displayName: 'Outros', values: Array(12).fill(0) },
  ],
  reserves: [
    { id: 'investimentos-reserva', name: 'investimentos-reserva', displayName: 'Investimentos', values: Array(12).fill(0) },
    { id: 'poupanca', name: 'poupanca', displayName: 'Poupança', values: Array(12).fill(0) },
  ],
});

export const useEditableMonthlySummary = (year: number) => {
  const [data, setData] = useState<EditableMonthlySummary>(() => {
    const saved = localStorage.getItem(`monthly-summary-${year}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    return {
      year,
      ...getInitialCategories(),
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(`monthly-summary-${year}`, JSON.stringify(data));
  }, [data, year]);

  // Update year when it changes
  useEffect(() => {
    const saved = localStorage.getItem(`monthly-summary-${year}`);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved data:', error);
        setData({
          year,
          ...getInitialCategories(),
        });
      }
    } else {
      setData({
        year,
        ...getInitialCategories(),
      });
    }
  }, [year]);

  const updateCategoryValue = useCallback((
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    categoryId: string,
    monthIndex: number,
    value: number
  ) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(cat =>
        cat.id === categoryId
          ? { ...cat, values: cat.values.map((v, i) => i === monthIndex ? value : v) }
          : cat
      )
    }));
  }, []);

  const addCategory = useCallback((
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    name: string
  ) => {
    const displayName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    setData(prev => ({
      ...prev,
      [section]: [
        ...prev[section],
        {
          id,
          name: name.toLowerCase().replace(/\s+/g, '-'),
          displayName,
          values: Array(12).fill(0)
        }
      ]
    }));
  }, []);

  const removeCategory = useCallback((
    section: keyof Omit<EditableMonthlySummary, 'year'>,
    categoryId: string
  ) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter(cat => cat.id !== categoryId)
    }));
  }, []);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const monthlyTotals = Array(12).fill(0).map((_, monthIndex) => {
      const revenue = data.revenue.reduce((sum, cat) => sum + cat.values[monthIndex], 0);
      const essential = data.essentialExpenses.reduce((sum, cat) => sum + cat.values[monthIndex], 0);
      const nonEssential = data.nonEssentialExpenses.reduce((sum, cat) => sum + cat.values[monthIndex], 0);
      const reserves = data.reserves.reduce((sum, cat) => sum + cat.values[monthIndex], 0);
      
      return {
        revenue,
        essential,
        nonEssential,
        reserves,
        surplus: revenue - essential - nonEssential - reserves
      };
    });

    return monthlyTotals;
  }, [data]);

  const totals = calculateTotals();

  return {
    data,
    updateCategoryValue,
    addCategory,
    removeCategory,
    totals,
    isLoading: false,
    error: null
  };
};
