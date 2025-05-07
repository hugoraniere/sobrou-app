
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
    'laboratorio': 'saude',
    'laboratório': 'saude',
    'dentista': 'saude',
    'vacina': 'saude',
    'clinica': 'saude',
    'clínica': 'saude',
    'odonto': 'saude',
    
    // Alimentação
    'restaurante': 'alimentacao',
    'lanchonete': 'alimentacao',
    'mercado': 'alimentacao',
    'supermercado': 'alimentacao',
    'delivery': 'alimentacao',
    'ifood': 'alimentacao',
    'padaria': 'alimentacao',
    'refeição': 'alimentacao',
    'refeicao': 'alimentacao',
    'lanche': 'alimentacao',
    'pizza': 'alimentacao',
    'hortifruti': 'alimentacao',
    'feira': 'alimentacao',
    'frutaria': 'alimentacao',
    'sacolão': 'alimentacao',
    'sacolao': 'alimentacao',
    
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
    'pedágio': 'transporte',
    'pedagio': 'transporte',
    'passagem': 'transporte',
    'bilhete': 'transporte',
    'posto': 'transporte',
    'carro': 'transporte',
    'moto': 'transporte',
    
    // Cartão de crédito
    'fatura': 'cartao',
    'nubank': 'cartao',
    'cartão': 'cartao',
    'cartao': 'cartao',
    'crédito': 'cartao',
    'credito': 'cartao',
    'banco': 'cartao',
    'bradesco': 'cartao',
    'itau': 'cartao',
    'santander': 'cartao',
    'inter': 'cartao',
    'caixa': 'cartao',
    'bb': 'cartao',
    'tarifa': 'cartao',
    'mastercard': 'cartao',
    'visa': 'cartao',
    'elo': 'cartao',
    
    // Internet
    'telefone': 'internet',
    'internet': 'internet',
    'wifi': 'internet',
    'celular': 'internet',
    'oi': 'internet',
    'vivo': 'internet',
    'tim': 'internet',
    'claro': 'internet',
    'movel': 'internet',
    'móvel': 'internet',
    'fibra': 'internet',
    'banda larga': 'internet',
    'tv': 'internet',
    'netflix': 'internet',
    'prime': 'internet',
    'spotify': 'internet',
    'disney': 'internet',
    'assinatura': 'internet',
    
    // Lazer
    'cinema': 'lazer',
    'show': 'lazer',
    'ingresso': 'lazer',
    'jogo': 'lazer',
    'bebidas': 'lazer',
    'bar': 'lazer',
    'balada': 'lazer',
    'festa': 'lazer',
    'academia': 'lazer',
    'parque': 'lazer',
    'clube': 'lazer',
    'esporte': 'lazer',
    'viagem': 'lazer',
    'hotel': 'lazer',
    'pousada': 'lazer',
    'churras': 'lazer',
    'passeio': 'lazer',
    'tour': 'lazer',
    
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
    'enel': 'moradia',
    'sabesp': 'moradia',
    'comgas': 'moradia',
    'manutenção': 'moradia',
    'manutencao': 'moradia',
    'reparo': 'moradia',
    'reforma': 'moradia',
    'portaria': 'moradia',
    
    // Compras
    'shopping': 'compras',
    'loja': 'compras',
    'roupa': 'compras',
    'calçado': 'compras',
    'calcado': 'compras',
    'sapato': 'compras',
    'móveis': 'compras',
    'moveis': 'compras',
    'eletrodoméstico': 'compras',
    'eletrodomestico': 'compras',
    'eletrônico': 'compras',
    'eletronico': 'compras',
    // 'celular' já definido em 'internet'
    'computador': 'compras',
    'notebook': 'compras',
    'mercado livre': 'compras',
    'amazon': 'compras',
    'magazine': 'compras',
    'americanas': 'compras',
    
    // Investimentos
    'investimento': 'investimentos',
    'aplicação': 'investimentos',
    'aplicacao': 'investimentos',
    'tesouro': 'investimentos',
    'cdb': 'investimentos',
    'lci': 'investimentos',
    'lca': 'investimentos',
    'ações': 'investimentos',
    'acoes': 'investimentos',
    'bolsa': 'investimentos',
    'fgts': 'investimentos',
    'previdência': 'investimentos',
    'previdencia': 'investimentos',
    'poupança': 'investimentos',
    'poupanca': 'investimentos',
    'rendimento': 'investimentos',
    'dividendo': 'investimentos',
    'renda fixa': 'investimentos',
    'renda variável': 'investimentos',
    'renda variavel': 'investimentos',
    
    // Família
    'escola': 'familia',
    'colégio': 'familia',
    'colegio': 'familia',
    'creche': 'familia',
    'uniforme': 'familia',
    'material escolar': 'familia',
    'mensalidade': 'familia',
    'filho': 'familia',
    'filha': 'familia',
    'criança': 'familia',
    'crianca': 'familia',
    'brinquedo': 'familia',
    'fralda': 'familia',
    'bebê': 'familia',
    'bebe': 'familia',
    'pediatra': 'familia',
    'educação': 'familia',
    'educacao': 'familia',
    
    // Doações
    'doação': 'doacoes',
    'doacao': 'doacoes',
    'caridade': 'doacoes',
    'contribuição': 'doacoes',
    'contribuicao': 'doacoes',
    'ajuda': 'doacoes',
    'igreja': 'doacoes',
    'ong': 'doacoes',
    'campanha': 'doacoes',
    'solidariedade': 'doacoes',
    'voluntariado': 'doacoes',
    'apoio': 'doacoes',
    'instituição': 'doacoes',
    'instituicao': 'doacoes'
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

export const parseCurrencyToNumber = (value: string): number => {
  // Remove all dots and replace comma with dot for proper number conversion
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  const number = parseFloat(cleanValue);
  return isNaN(number) ? 0 : number;
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatCurrencyInput = (value: string): string => {
  // Remove any non-digit characters except comma and dot
  let cleanValue = value.replace(/[^\d.,]/g, '');
  
  // Handle decimal part
  const parts = cleanValue.split(',');
  if (parts.length > 1) {
    // Keep only two decimal places
    cleanValue = `${parts[0]},${parts[1].slice(0, 2)}`;
  }
  
  // Convert to number for formatting
  const numberValue = Number(cleanValue.replace('.', '').replace(',', '.'));
  if (isNaN(numberValue)) return '';
  
  // Format as Brazilian currency
  return numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
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
