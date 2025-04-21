
import { BarChartBig, CreditCard, Home, ShoppingBag, Coffee, Car, Utensils, Train, Plane, HeartPulse, Landmark, GraduationCap, Gift, PartyPopper, Zap, Droplets, Wifi, Phone, DollarSign, Wallet } from "lucide-react";
import React from 'react';

export interface TransactionCategory {
  id: string;
  name: string;
  icon: React.ComponentType;
  color: string;
}

// Adicionando a interface para manter compatibilidade com código existente
export interface CategoryItem {
  value: string;
  label: string;
  color: string;
  icon: React.ReactNode | null;
}

export const transactionCategories: TransactionCategory[] = [
  { id: 'salary', name: 'Salário', icon: Wallet, color: '#4CAF50' },
  { id: 'investment', name: 'Investimento', icon: DollarSign, color: '#2196F3' },
  { id: 'extra_income', name: 'Renda Extra', icon: CreditCard, color: '#673AB7' },
  { id: 'housing', name: 'Moradia', icon: Home, color: '#795548' },
  { id: 'shopping', name: 'Compras', icon: ShoppingBag, color: '#FF5722' },
  { id: 'food', name: 'Alimentação', icon: Utensils, color: '#FF9800' },
  { id: 'coffee', name: 'Café', icon: Coffee, color: '#A52A2A' },
  { id: 'transportation', name: 'Transporte', icon: Car, color: '#607D8B' },
  { id: 'public_transport', name: 'Transporte Público', icon: Train, color: '#3F51B5' },
  { id: 'travel', name: 'Viagem', icon: Plane, color: '#00BCD4' },
  { id: 'health', name: 'Saúde', icon: HeartPulse, color: '#E91E63' },
  { id: 'banking', name: 'Bancos', icon: Landmark, color: '#9C27B0' },
  { id: 'education', name: 'Educação', icon: GraduationCap, color: '#FFC107' },
  { id: 'gift', name: 'Presentes', icon: Gift, color: '#E040FB' },
  { id: 'entertainment', name: 'Entretenimento', icon: PartyPopper, color: '#8BC34A' },
  { id: 'utilities', name: 'Utilidades', icon: Zap, color: '#F44336' },
  { id: 'water', name: 'Água', icon: Droplets, color: '#03A9F4' },
  { id: 'internet', name: 'Internet', icon: Wifi, color: '#009688' },
  { id: 'phone', name: 'Telefone', icon: Phone, color: '#FF4081' },
  { id: 'credit_card', name: 'Cartão de Crédito', icon: CreditCard, color: '#9C27B0' },
  { id: 'other', name: 'Outros', icon: BarChartBig, color: '#9E9E9E' }
];

// Convertendo transactionCategories para o formato usado por outros componentes
export const categories: CategoryItem[] = transactionCategories.map(category => ({
  value: category.id,
  label: category.name,
  color: `bg-[${category.color}] text-white`,
  icon: React.createElement(category.icon, { size: 16 })
}));

// Function to get category by keyword in description
export const getCategoryByKeyword = (description: string): TransactionCategory | null => {
  const normalizedDescription = description.toLowerCase();
  
  // Define keyword mappings
  const categoryKeywords: Record<string, string[]> = {
    'salary': ['salário', 'salario', 'pagamento', 'contracheque', 'holerite'],
    'investment': ['investimento', 'dividendo', 'juros', 'ações', 'acoes', 'rendimento'],
    'extra_income': ['extra', 'bônus', 'bonus', 'freelance', 'adicional'],
    'housing': ['aluguel', 'hipoteca', 'condomínio', 'condominio', 'apartamento', 'casa', 'moradia'],
    'shopping': ['compra', 'loja', 'roupa', 'vestuário'],
    'food': ['comida', 'restaurante', 'almoço', 'jantar', 'delivery', 'ifood'],
    'coffee': ['café', 'cafe', 'starbucks'],
    'transportation': ['gasolina', 'combustível', 'combustivel', 'uber', '99', 'táxi', 'taxi', 'transporte'],
    'public_transport': ['metro', 'metrô', 'ônibus', 'onibus', 'trem', 'bilhete'],
    'travel': ['viagem', 'hotel', 'passagem', 'airbnb', 'hospedagem'],
    'health': ['saúde', 'saude', 'médico', 'medico', 'dentista', 'hospital', 'farmácia', 'farmacia'],
    'banking': ['banco', 'taxa', 'tarifa', 'iof', 'juros', 'empréstimo', 'emprestimo'],
    'education': ['educação', 'educacao', 'escola', 'curso', 'faculdade', 'universidade'],
    'gift': ['presente', 'aniversário', 'aniversario', 'natal'],
    'entertainment': ['entretenimento', 'cinema', 'filme', 'show', 'concerto', 'netflix', 'spotify', 'stream'],
    'utilities': ['conta', 'luz', 'gás', 'gas'],
    'water': ['água', 'agua', 'saneamento'],
    'internet': ['internet', 'wifi', 'banda larga'],
    'phone': ['telefone', 'celular'],
    'credit_card': ['cartão de crédito', 'cartao de credito', 'cartão', 'cartao', 'fatura cartão', 'fatura do cartão', 'nubank', 'itaucard', 'credicard']
  };
  
  // Check for keywords in the description
  for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => normalizedDescription.includes(keyword))) {
      const category = transactionCategories.find(cat => cat.id === categoryId);
      if (category) {
        return category;
      }
    }
  }
  
  // Return the "other" category if no match found
  return transactionCategories.find(cat => cat.id === 'other') || null;
};
