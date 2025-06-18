
export interface SectionConfig {
  title: string;
  section: string;
  bgColor: string;
  textColor: string;
}

export const getSectionConfigs = (): SectionConfig[] => [
  {
    title: 'RECEITAS (R)',
    section: 'revenue',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    title: 'DESPESAS ESSENCIAIS (D1)',
    section: 'essentialExpenses',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  },
  {
    title: 'DESPESAS NÃO ESSENCIAIS (D2)',
    section: 'nonEssentialExpenses',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  {
    title: 'RESERVAS MENSAIS',
    section: 'reserves',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  }
];
