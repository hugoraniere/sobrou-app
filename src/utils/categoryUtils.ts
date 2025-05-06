
import { transactionCategories } from '@/data/categories';
import { categoryKeywords } from '@/data/categoryKeywords';

export const getCategoryByKeyword = (text: string): { id: string, name: string } | null => {
  if (!text) return null;
  
  const textLower = text.toLowerCase();
  
  // Primeira tentativa: correspondência exata com o nome
  const exactMatch = transactionCategories.find(
    cat => cat.name.toLowerCase() === textLower || textLower.includes(cat.name.toLowerCase())
  );
  
  if (exactMatch) return { id: exactMatch.id, name: exactMatch.name };
  
  // Segunda tentativa: verificar palavras-chave detalhadas no mapeamento de categorias
  for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      const category = transactionCategories.find(cat => cat.id === categoryId);
      if (category) return { id: category.id, name: category.name };
    }
  }
  
  // Terceira tentativa: mapeamento de sinônimos comuns
  const synonymMap: Record<string, string> = {
    // Saúde
    'farmacia': 'saude',
    'farmácia': 'saude',
    'hospital': 'saude',
    'drogaria': 'saude',
    'remedio': 'saude',
    'remédio': 'saude',
    'médico': 'saude',
    'medico': 'saude',
    'consulta': 'saude',
    'exame': 'saude',
    
    // Alimentação
    'restaurante': 'alimentacao',
    'lanchonete': 'alimentacao',
    'mercado': 'alimentacao',
    'supermercado': 'alimentacao',
    'delivery': 'alimentacao',
    'ifood': 'alimentacao',
    
    // Transporte
    'uber': 'transporte',
    'taxi': 'transporte',
    '99': 'transporte',
    'gasolina': 'transporte',
    'combustível': 'transporte',
    'combustivel': 'transporte',
    'estacionamento': 'transporte',
    'ônibus': 'transporte',
    'onibus': 'transporte',
    'metrô': 'transporte',
    'metro': 'transporte',
    
    // Cartão de crédito
    'fatura': 'cartao',
    'nubank': 'cartao',
    'cartão': 'cartao',
    'cartao': 'cartao',
    'crédito': 'cartao',
    'credito': 'cartao',
    'banco': 'cartao',
    
    // Internet
    'telefone': 'internet',
    'internet': 'internet',
    'wifi': 'internet',
    'celular': 'internet',
    'oi': 'internet',
    'vivo': 'internet',
    'tim': 'internet',
    'claro': 'internet',
    
    // Lazer
    'cinema': 'lazer',
    'netflix': 'lazer',
    'spotify': 'lazer',
    'show': 'lazer',
    'ingresso': 'lazer',
    'jogo': 'lazer',
    'bebidas': 'lazer',
    'bar': 'lazer',
    
    // Moradia
    'aluguel': 'moradia',
    'condomínio': 'moradia',
    'condominio': 'moradia',
    'imobiliária': 'moradia',
    'imobiliaria': 'moradia',
    'iptu': 'moradia',
    'luz': 'moradia',
    'energia': 'moradia',
    'água': 'moradia',
    'agua': 'moradia',
    'gás': 'moradia',
    'gas': 'moradia',
  };
  
  for (const [synonym, categoryId] of Object.entries(synonymMap)) {
    if (textLower.includes(synonym)) {
      const category = transactionCategories.find(cat => cat.id === categoryId);
      if (category) return { id: category.id, name: category.name };
    }
  }
  
  // Se nenhuma correspondência for encontrada, retornar null
  return null;
};

// Função melhorada para determinar categorias a partir do texto
export const determineBestCategory = (description: string, amount: number, type: string): string => {
  // Primeiro, tente usar o mapeamento de palavras-chave
  const keywordMatch = getCategoryByKeyword(description);
  if (keywordMatch) {
    return keywordMatch.id;
  }
  
  // Heurísticas baseadas em valores e tipos
  if (type === 'income') {
    // Rendas geralmente são salário ou investimentos
    if (amount > 1000) {
      return 'investimentos'; // Provavelmente salário ou grandes rendimentos
    }
    return 'compras'; // Valor padrão para rendas menores
  } else {
    // Despesas têm categorização mais específica
    if (amount > 1000) {
      // Valores altos provavelmente são moradia ou cartão
      return 'moradia';
    } else if (amount < 20) {
      // Valores muito pequenos geralmente são despesas de alimentação ou transporte
      return 'alimentacao';
    }
  }
  
  // Categoria padrão como fallback
  return 'compras';
};
