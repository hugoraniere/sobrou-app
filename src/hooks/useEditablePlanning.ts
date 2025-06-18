
import { useState, useEffect, useCallback } from 'react';
import { EditableCategoryData } from './useEditableMonthlySummary';

export interface EditablePlanningData {
  year: number;
  revenue: EditableCategoryData[];
  essentialExpenses: EditableCategoryData[];
  nonEssentialExpenses: EditableCategoryData[];
  reserves: EditableCategoryData[];
}

const getInitialPlanningCategories = () => ({
  revenue: [
    { id: 'salario', name: 'salario', displayName: 'Salário', values: Array(12).fill(0) },
    { id: 'aluguel', name: 'aluguel', displayName: 'Aluguel', values: Array(12).fill(0) },
    { id: 'transferencias', name: 'transferencias', displayName: 'Transferências', values: Array(12).fill(0) },
    { id: 'outros-receita', name: 'outros-receita', displayName: 'Outros', values: Array(12).fill(0) },
  ],
  essentialExpenses: [
    { id: 'luz', name: 'luz', displayName: 'Luz', values: Array(12).fill(0) },
    { id: 'agua', name: 'agua', displayName: 'Água', values: Array(12).fill(0) },
    { id: 'internet', name: 'internet', displayName: 'Internet', values: Array(12).fill(0) },
    { id: 'transporte', name: 'transporte', displayName: 'Transporte', values: Array(12).fill(0) },
    { id: 'alimentacao', name: 'alimentacao', displayName: 'Alimentação', values: Array(12).fill(0) },
    { id: 'cartao-credito', name: 'cartao-credito', displayName: 'Cartão de Crédito', values: Array(12).fill(0) },
    { id: 'manutencao-carro', name: 'manutencao-carro', displayName: 'Manutenção Carro', values: Array(12).fill(0) },
    { id: 'emprestimo', name: 'emprestimo', displayName: 'Empréstimo', values: Array(12).fill(0) },
    { id: 'manutencao-apto', name: 'manutencao-apto', displayName: 'Manutenção Apto', values: Array(12).fill(0) },
    { id: 'diarista', name: 'diarista', displayName: 'Diarista', values: Array(12).fill(0) },
    { id: 'outros-essencial', name: 'outros-essencial', displayName: 'Outros', values: Array(12).fill(0) },
  ],
  nonEssentialExpenses: [
    { id: 'academia', name: 'academia', displayName: 'Academia', values: Array(12).fill(0) },
    { id: 'plano-saude', name: 'plano-saude', displayName: 'Plano de Saúde', values: Array(12).fill(0) },
    { id: 'mei', name: 'mei', displayName: 'MEI', values: Array(12).fill(0) },
    { id: 'estudos', name: 'estudos', displayName: 'Estudos', values: Array(12).fill(0) },
    { id: 'alimentacao-extra', name: 'alimentacao-extra', displayName: 'Alimentação (Gastos extras)', values: Array(12).fill(0) },
    { id: 'celular', name: 'celular', displayName: 'Celular (Mensalidade)', values: Array(12).fill(0) },
    { id: 'assinaturas', name: 'assinaturas', displayName: 'Assinaturas Mensais', values: Array(12).fill(0) },
    { id: 'dentista', name: 'dentista', displayName: 'Dentista', values: Array(12).fill(0) },
    { id: 'outros-nao-essencial', name: 'outros-nao-essencial', displayName: 'Outros', values: Array(12).fill(0) },
  ],
  reserves: [
    { id: 'montante-investido', name: 'montante-investido', displayName: 'Montante Investido no mês', values: Array(12).fill(0) },
    { id: 'investimentos-medio-longo', name: 'investimentos-medio-longo', displayName: 'Total de Investimentos em Médio e Longo Prazo', values: Array(12).fill(0) },
    { id: 'investimentos-curto', name: 'investimentos-curto', displayName: 'Total de Investimentos em Curto Prazo', values: Array(12).fill(0) },
    { id: 'percentual-sobra', name: 'percentual-sobra', displayName: '% de Sobra', values: Array(12).fill(0) },
    { id: 'fundo-emergencia', name: 'fundo-emergencia', displayName: 'Quanto Falta para o Fundo de Emergência', values: Array(12).fill(0) },
    { id: 'sobra-mensal', name: 'sobra-mensal', displayName: 'Sobra Mensal (R - D1 - D2)', values: Array(12).fill(0) },
  ],
});

export const useEditablePlanning = (year: number) => {
  const [data, setData] = useState<EditablePlanningData>(() => {
    const saved = localStorage.getItem(`monthly-planning-${year}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved planning data:', error);
      }
    }
    return {
      year,
      ...getInitialPlanningCategories(),
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(`monthly-planning-${year}`, JSON.stringify(data));
  }, [data, year]);

  // Update year when it changes
  useEffect(() => {
    const saved = localStorage.getItem(`monthly-planning-${year}`);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved planning data:', error);
        setData({
          year,
          ...getInitialPlanningCategories(),
        });
      }
    } else {
      setData({
        year,
        ...getInitialPlanningCategories(),
      });
    }
  }, [year]);

  const updateCategoryValue = useCallback((
    section: keyof Omit<EditablePlanningData, 'year'>,
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

  const updateCategoryName = useCallback((
    section: keyof Omit<EditablePlanningData, 'year'>,
    categoryId: string,
    newName: string
  ) => {
    const displayName = newName.charAt(0).toUpperCase() + newName.slice(1);
    
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(cat =>
        cat.id === categoryId
          ? { ...cat, displayName }
          : cat
      )
    }));
  }, []);

  const addCategory = useCallback((
    section: keyof Omit<EditablePlanningData, 'year'>,
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
    updateCategoryName,
    addCategory,
    totals,
    isLoading: false,
    error: null
  };
};
