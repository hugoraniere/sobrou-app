import { supabase } from '@/integrations/supabase/client';
import { Transaction } from './transactions/types';

export interface MEIMonthlyReport {
  period: {
    year: number;
    month: number;
  };
  revenue: {
    total: number;
    count: number;
    transactions: Transaction[];
  };
  costs: {
    byCategory: Array<{ category: string; amount: number; count: number }>;
    total: number;
  };
  taxReserve: number;
  profit: number;
  margin: number;
  taxPercentage: number;
}

export const meiReportService = {
  async generateMonthlyClosing(
    year: number,
    month: number,
    useCompetenceDate: boolean = false
  ): Promise<MEIMonthlyReport> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Buscar configurações MEI
    const { data: meiSettings } = await supabase
      .from('mei_settings')
      .select('tax_reserve_percentage')
      .eq('user_id', user.id)
      .maybeSingle();

    const taxPercentage = meiSettings?.tax_reserve_percentage || 6;

    // Período de datas
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    // Campo de data a usar
    const dateField = useCompetenceDate ? 'competence_date' : 'date';

    // Buscar transações do mês
    const { data: rawTransactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte(dateField, startDate)
      .lte(dateField, endDate)
      .order(dateField, { ascending: true });

    if (error) throw error;

    // Converter para tipo Transaction
    const transactions: Transaction[] = (rawTransactions || []).map((t: any) => ({
      ...t,
      type: t.type as 'income' | 'expense' | 'transfer',
    }));

    // Separar receitas e despesas
    const revenues = transactions.filter((t) => t.type === 'income');
    const expenses = transactions.filter((t) => t.type === 'expense');

    // Calcular total de receitas
    const revenueTotal = revenues.reduce((sum, t) => sum + t.amount, 0);

    // Agrupar custos por categoria
    const costsByCategory: Record<string, { amount: number; count: number }> = {};
    expenses.forEach((t) => {
      if (!costsByCategory[t.category]) {
        costsByCategory[t.category] = { amount: 0, count: 0 };
      }
      costsByCategory[t.category].amount += t.amount;
      costsByCategory[t.category].count += 1;
    });

    const costsByCategoryArray = Object.entries(costsByCategory).map(
      ([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
      })
    ).sort((a, b) => b.amount - a.amount);

    const costsTotal = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Calcular impostos a reservar
    const taxReserve = revenueTotal * (taxPercentage / 100);

    // Calcular lucro e margem
    const profit = revenueTotal - costsTotal;
    const margin = revenueTotal > 0 ? (profit / revenueTotal) * 100 : 0;

    return {
      period: { year, month },
      revenue: {
        total: revenueTotal,
        count: revenues.length,
        transactions: revenues,
      },
      costs: {
        byCategory: costsByCategoryArray,
        total: costsTotal,
      },
      taxReserve,
      profit,
      margin,
      taxPercentage,
    };
  },
};
