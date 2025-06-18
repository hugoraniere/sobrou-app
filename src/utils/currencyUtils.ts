// Helper function to format currency input for Brazilian Real (R$)
export const formatCurrencyInput = (value: string): string => {
  // Durante a digitação, não formatar - apenas limpar caracteres inválidos
  // Remove any non-digit characters except comma and dot
  let cleanValue = value.replace(/[^\d.,]/g, '');
  
  // Se o valor está vazio, retornar vazio
  if (!cleanValue) return '';
  
  // Se contém apenas dígitos, deixar como está para digitação natural
  if (/^\d+$/.test(cleanValue)) {
    return cleanValue;
  }
  
  // Tratar ponto como separador de milhar e vírgula como separador decimal
  if (cleanValue.includes('.')) {
    // Remove todos os pontos e preserve a vírgula como separador decimal
    cleanValue = cleanValue.replace(/\./g, '');
  }
  
  // Handle decimal part
  const parts = cleanValue.split(',');
  if (parts.length > 1) {
    // Keep only two decimal places
    cleanValue = `${parts[0]},${parts[1].slice(0, 2)}`;
  }
  
  return cleanValue;
};

export const parseCurrencyToNumber = (value: string): number => {
  // Se é apenas um número inteiro, converter diretamente
  if (/^\d+$/.test(value)) {
    return parseFloat(value);
  }
  
  // Remove all dots (thousand separators) and replace comma with dot for proper number conversion
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  const number = parseFloat(cleanValue);
  return isNaN(number) ? 0 : number;
};

// Nova função para formatação de moeda
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Função ausente que estava causando erro
export const formatCurrencyNoDecimals = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

// Nova função para formatar apenas para visualização (não para edição)
export const formatCurrencyForDisplay = (value: number): string => {
  if (value === 0) return '-';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
