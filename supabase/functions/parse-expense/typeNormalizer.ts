// Normalizador determinístico para classificação de tipo de transação
// Garante que verbos claros de despesa/receita sejam classificados corretamente

export const EXPENSE_TRIGGERS = [
  // Verbos de gasto direto
  'gastei', 'gasto', 'paguei', 'pago', 'comprei', 'compro',
  'saiu', 'sai', 'debito', 'débito', 'perdi', 'perco',
  
  // Expressões de gasto
  'gastando', 'pagando', 'comprando', 'perdendo',
  'foi gasto', 'foi pago', 'foi comprado',
  'vou gastar', 'vou pagar', 'vou comprar',
  
  // Contextos de gasto
  'conta de', 'fatura', 'boleto', 'parcela', 'prestação',
  'multa', 'taxa', 'juros', 'despesa', 'custo'
];

export const INCOME_TRIGGERS = [
  // Verbos de recebimento direto
  'recebi', 'recebo', 'ganhei', 'ganho', 'entrou',
  'entrada', 'crédito', 'deposito', 'depósito',
  
  // Expressões de recebimento
  'recebendo', 'ganhando', 'foi recebido', 'foi depositado',
  'vou receber', 'vou ganhar', 'caiu na conta',
  
  // Contextos de receita
  'salário', 'salario', 'pagamento', 'freelancer', 'freela',
  'bônus', 'bonus', 'comissão', 'comissao', 'prêmio', 'premio',
  'restituição', 'restituicao', 'cashback', 'dividendos',
  'aluguel recebido', 'venda', 'faturei', 'lucro', 'rendimento'
];

export function normalizeTransactionType(text: string, aiType?: string): 'expense' | 'income' {
  const lowerText = text.toLowerCase();
  
  // 1. Prioridade máxima: detectar sinal explícito +/-
  const signMatch = text.match(/([+-])\s*(?:r\$|\$)?\s*\d+(?:[.,]\d+)?/i);
  if (signMatch) {
    const sign = signMatch[1];
    return sign === '+' ? 'income' : 'expense';
  }
  
  // 2. Verificar triggers de despesa (mais específicos)
  const hasExpenseTrigger = EXPENSE_TRIGGERS.some(trigger => 
    lowerText.includes(trigger)
  );
  
  if (hasExpenseTrigger) {
    return 'expense';
  }
  
  // 3. Verificar triggers de receita
  const hasIncomeTrigger = INCOME_TRIGGERS.some(trigger => 
    lowerText.includes(trigger)
  );
  
  if (hasIncomeTrigger) {
    return 'income';
  }
  
  // 4. Se não houver triggers claros, usar resultado da IA
  if (aiType === 'income' || aiType === 'receita') {
    return 'income';
  }
  
  // 5. Padrão: despesa (mais comum)
  return 'expense';
}