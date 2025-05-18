
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
  Gift,
  HelpCircle
} from 'lucide-react';

export const expenseCategories: CategoryType[] = [
  { 
    id: 'alimentacao',
    name: 'Alimentação', 
    value: 'alimentacao',
    type: 'expense',
    label: 'Alimentação',
    color: 'text-red-800',
    icon: Utensils
  },
  { 
    id: 'moradia',
    name: 'Moradia', 
    value: 'moradia',
    type: 'expense',
    label: 'Moradia',
    color: 'text-blue-800',
    icon: Home
  },
  { 
    id: 'transporte',
    name: 'Transporte', 
    value: 'transporte',
    type: 'expense',
    label: 'Transporte',
    color: 'text-yellow-800',
    icon: Car
  },
  { 
    id: 'internet',
    name: 'Internet', 
    value: 'internet',
    type: 'expense',
    label: 'Internet',
    color: 'text-purple-800',
    icon: Wifi
  },
  { 
    id: 'cartao',
    name: 'Cartão', 
    value: 'cartao',
    type: 'expense',
    label: 'Cartão',
    color: 'text-indigo-800',
    icon: CreditCard
  },
  { 
    id: 'saude',
    name: 'Saúde', 
    value: 'saude',
    type: 'expense',
    label: 'Saúde',
    color: 'text-green-800',
    icon: Heart
  },
  { 
    id: 'lazer',
    name: 'Lazer', 
    value: 'lazer',
    type: 'expense',
    label: 'Lazer',
    color: 'text-pink-800',
    icon: Gamepad
  },
  { 
    id: 'compras',
    name: 'Compras', 
    value: 'compras',
    type: 'expense',
    label: 'Compras',
    color: 'text-gray-800',
    icon: ShoppingBag
  },
  { 
    id: 'investimentos',
    name: 'Investimentos', 
    value: 'investimentos',
    type: 'expense',
    label: 'Investimentos',
    color: 'text-emerald-800',
    icon: LineChart
  },
  { 
    id: 'familia',
    name: 'Família', 
    value: 'familia',
    type: 'expense',
    label: 'Família',
    color: 'text-cyan-800',
    icon: Users
  },
  { 
    id: 'doacoes',
    name: 'Doações', 
    value: 'doacoes',
    type: 'expense',
    label: 'Doações',
    color: 'text-rose-800',
    icon: Gift
  },
  { 
    id: 'other',
    name: 'Outros', 
    value: 'other',
    type: 'expense',
    label: 'Outros',
    color: 'text-gray-800',
    icon: HelpCircle
  },
  { 
    id: 'outros',
    name: 'Outros', 
    value: 'outros',
    type: 'expense',
    label: 'Outros',
    color: 'text-gray-800',
    icon: HelpCircle
  }
];
