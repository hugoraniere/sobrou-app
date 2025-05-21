// Helper function to format currency input for Brazilian Real (R$)
export const formatCurrencyInput = (value: string): string => {
  // Remove any non-digit characters except comma and dot
  let cleanValue = value.replace(/[^\d.,]/g, '');
  
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
  
  // Convert to number for formatting
  const numberValue = Number(cleanValue.replace(',', '.'));
  if (isNaN(numberValue)) return '';
  
  // Format as Brazilian currency with dot as thousand separator
  return numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const parseCurrencyToNumber = (value: string): number => {
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

// Função para formatação de moeda sem decimais
export const formatCurrencyNoDecimals = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
