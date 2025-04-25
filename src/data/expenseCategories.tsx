
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
    color: 'text-black',
    icon: Utensils
  },
  { 
    id: 'housing',
    name: 'Moradia', 
    value: 'housing',
    type: 'expense',
    label: 'Moradia',
    color: 'text-black',
    icon: Home
  },
  { 
    id: 'transport',
    name: 'Transporte', 
    value: 'transport',
    type: 'expense',
    label: 'Transporte',
    color: 'text-black',
    icon: Car
  },
  { 
    id: 'internet',
    name: 'Internet / Telecom', 
    value: 'internet',
    type: 'expense',
    label: 'Internet / Telecom',
    color: 'text-black',
    icon: Wifi
  },
  { 
    id: 'credit_card',
    name: 'Cartão de Crédito', 
    value: 'credit_card',
    type: 'expense',
    label: 'Cartão de Crédito',
    color: 'text-black',
    icon: CreditCard
  },
  { 
    id: 'health',
    name: 'Saúde', 
    value: 'health',
    type: 'expense',
    label: 'Saúde',
    color: 'text-black',
    icon: Heart
  },
  { 
    id: 'entertainment',
    name: 'Lazer / Entretenimento', 
    value: 'entertainment',
    type: 'expense',
    label: 'Lazer / Entretenimento',
    color: 'text-black',
    icon: Gamepad
  },
  { 
    id: 'shopping',
    name: 'Compras / Outros', 
    value: 'shopping',
    type: 'expense',
    label: 'Compras / Outros',
    color: 'text-black',
    icon: ShoppingBag
  },
  { 
    id: 'investment',
    name: 'Investimentos / Poupança', 
    value: 'investment',
    type: 'expense',
    label: 'Investimentos / Poupança',
    color: 'text-black',
    icon: LineChart
  },
  { 
    id: 'family',
    name: 'Família / Filhos', 
    value: 'family',
    type: 'expense',
    label: 'Família / Filhos',
    color: 'text-black',
    icon: Users
  },
  { 
    id: 'donation',
    name: 'Doações / Ajuda', 
    value: 'donation',
    type: 'expense',
    label: 'Doações / Ajuda',
    color: 'text-black',
    icon: Gift
  }
];
