
export const INCOME_CATEGORIES = {
  'salario': 'Salário',
  'freelance': 'Freelance',
  'aluguel-recebido': 'Aluguel Recebido',
  'investimentos': 'Rendimentos',
  'outros-rendimentos': 'Outros'
};

export const ESSENTIAL_EXPENSES = {
  'moradia': 'Moradia',
  'alimentacao': 'Alimentação',
  'transporte': 'Transporte',
  'saude': 'Saúde',
  'internet': 'Internet',
  'cartao': 'Cartão'
};

export const NON_ESSENTIAL_EXPENSES = {
  'lazer': 'Lazer',
  'compras': 'Compras',
  'outros': 'Outros'
};

export const RESERVE_CATEGORIES = {
  'investimentos': 'Investimentos',
  'poupanca': 'Poupança'
};

// Função para classificar uma categoria
export const classifyCategory = (category: string): 'income' | 'essential' | 'non-essential' | 'reserve' => {
  if (INCOME_CATEGORIES[category as keyof typeof INCOME_CATEGORIES]) return 'income';
  if (ESSENTIAL_EXPENSES[category as keyof typeof ESSENTIAL_EXPENSES]) return 'essential';
  if (RESERVE_CATEGORIES[category as keyof typeof RESERVE_CATEGORIES]) return 'reserve';
  return 'non-essential';
};

export const getCategoryDisplayName = (category: string): string => {
  return INCOME_CATEGORIES[category as keyof typeof INCOME_CATEGORIES] ||
         ESSENTIAL_EXPENSES[category as keyof typeof ESSENTIAL_EXPENSES] ||
         NON_ESSENTIAL_EXPENSES[category as keyof typeof NON_ESSENTIAL_EXPENSES] ||
         RESERVE_CATEGORIES[category as keyof typeof RESERVE_CATEGORIES] ||
         category;
};
