
import { BarChartBig, CreditCard, Home, ShoppingBag, Coffee, Car, Utensils, Train, Plane, HeartPulse, Landmark, GraduationCap, Gift, PartyPopper, Zap, Droplets, Wifi, Phone, DollarSign, Wallet } from "lucide-react";

export interface TransactionCategory {
  id: string;
  name: string;
  icon: React.ComponentType;
  color: string; // Adicionando a propriedade color exigida
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
  { id: 'other', name: 'Outros', icon: BarChartBig, color: '#9E9E9E' }
];
