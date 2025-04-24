
import { CategoryType } from '../types/categories';
import {
  Utensils,
  Home,
  Car, 
  Wifi,
  CreditCard,
  Heart,
  Gamepad,
  ShoppingBag,
  LineChart,
  Users,
  Gift
} from 'lucide-react';

export const expenseCategories: CategoryType[] = [
  { 
    id: 'food',
    name: 'Alimentação', 
    value: 'food',
    type: 'expense',
    label: 'Alimentação',
    color: 'bg-red-100 text-red-800',
    icon: Utensils
  },
  { 
    id: 'housing',
    name: 'Moradia', 
    value: 'housing',
    type: 'expense',
    label: 'Moradia',
    color: 'bg-blue-100 text-blue-800',
    icon: Home
  },
  { 
    id: 'transport',
    name: 'Transporte', 
    value: 'transport',
    type: 'expense',
    label: 'Transporte',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Car
  },
  { 
    id: 'internet',
    name: 'Internet / Telecom', 
    value: 'internet',
    type: 'expense',
    label: 'Internet / Telecom',
    color: 'bg-purple-100 text-purple-800',
    icon: Wifi
  },
  { 
    id: 'credit_card',
    name: 'Cartão de Crédito', 
    value: 'credit_card',
    type: 'expense',
    label: 'Cartão de Crédito',
    color: 'bg-indigo-100 text-indigo-800',
    icon: CreditCard
  },
  { 
    id: 'health',
    name: 'Saúde', 
    value: 'health',
    type: 'expense',
    label: 'Saúde',
    color: 'bg-green-100 text-green-800',
    icon: Heart
  },
  { 
    id: 'entertainment',
    name: 'Lazer / Entretenimento', 
    value: 'entertainment',
    type: 'expense',
    label: 'Lazer / Entretenimento',
    color: 'bg-pink-100 text-pink-800',
    icon: Gamepad
  },
  { 
    id: 'shopping',
    name: 'Compras / Outros', 
    value: 'shopping',
    type: 'expense',
    label: 'Compras / Outros',
    color: 'bg-gray-100 text-gray-800',
    icon: ShoppingBag
  },
  { 
    id: 'investment',
    name: 'Investimentos / Poupança', 
    value: 'investment',
    type: 'expense',
    label: 'Investimentos / Poupança',
    color: 'bg-emerald-100 text-emerald-800',
    icon: LineChart
  },
  { 
    id: 'family',
    name: 'Família / Filhos', 
    value: 'family',
    type: 'expense',
    label: 'Família / Filhos',
    color: 'bg-cyan-100 text-cyan-800',
    icon: Users
  },
  { 
    id: 'donation',
    name: 'Doações / Ajuda', 
    value: 'donation',
    type: 'expense',
    label: 'Doações / Ajuda',
    color: 'bg-rose-100 text-rose-800',
    icon: Gift
  }
];
