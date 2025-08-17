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
  
  // Verificar triggers de despesa primeiro (mais específicos)
  const hasExpenseTrigger = EXPENSE_TRIGGERS.some(trigger => 
    lowerText.includes(trigger)
  );
  
  if (hasExpenseTrigger) {
    return 'expense';
  }
  
  // Verificar triggers de receita
  const hasIncomeTrigger = INCOME_TRIGGERS.some(trigger => 
    lowerText.includes(trigger)
  );
  
  if (hasIncomeTrigger) {
    return 'income';
  }
  
  // Se não houver triggers claros, usar resultado da IA ou padrão
  if (aiType === 'income' || aiType === 'receita') {
    return 'income';
  }
  
  // Padrão: despesa (mais comum)
  return 'expense';
}