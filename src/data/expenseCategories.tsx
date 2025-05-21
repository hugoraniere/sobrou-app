
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
import { CATEGORY_COLORS } from '@/constants/categoryColors';

export const expenseCategories: CategoryType[] = [
  { 
    id: 'alimentacao',
    name: 'Alimentação', 
    value: 'alimentacao',
    type: 'expense',
    label: 'Alimentação',
    color: 'bg-[#E15759]',
    icon: Utensils
  },
  { 
    id: 'moradia',
    name: 'Moradia', 
    value: 'moradia',
    type: 'expense',
    label: 'Moradia',
    color: 'bg-[#4E79A7]',
    icon: Home
  },
  { 
    id: 'transporte',
    name: 'Transporte', 
    value: 'transporte',
    type: 'expense',
    label: 'Transporte',
    color: 'bg-[#F28E2B]',
    icon: Car
  },
  { 
    id: 'internet',
    name: 'Internet', 
    value: 'internet',
    type: 'expense',
    label: 'Internet',
    color: 'bg-[#A173D1]',
    icon: Wifi
  },
  { 
    id: 'cartao',
    name: 'Cartão', 
    value: 'cartao',
    type: 'expense',
    label: 'Cartão',
    color: 'bg-[#7F7F7F]',
    icon: CreditCard
  },
  { 
    id: 'saude',
    name: 'Saúde', 
    value: 'saude',
    type: 'expense',
    label: 'Saúde',
    color: 'bg-[#59A14F]',
    icon: Heart
  },
  { 
    id: 'lazer',
    name: 'Lazer', 
    value: 'lazer',
    type: 'expense',
    label: 'Lazer',
    color: 'bg-[#B07AA1]',
    icon: Gamepad
  },
  { 
    id: 'compras',
    name: 'Compras', 
    value: 'compras',
    type: 'expense',
    label: 'Compras',
    color: 'bg-[#E377C2]',
    icon: ShoppingBag
  },
  { 
    id: 'investimentos',
    name: 'Investimentos', 
    value: 'investimentos',
    type: 'expense',
    label: 'Investimentos',
    color: 'bg-[#1F7C38]',
    icon: LineChart
  },
  { 
    id: 'familia',
    name: 'Família', 
    value: 'familia',
    type: 'expense',
    label: 'Família',
    color: 'bg-[#76B7B2]',
    icon: Users
  },
  { 
    id: 'doacoes',
    name: 'Doações', 
    value: 'doacoes',
    type: 'expense',
    label: 'Doações',
    color: 'bg-[#FFC107]',
    icon: Gift
  },
  { 
    id: 'other',
    name: 'Outros', 
    value: 'other',
    type: 'expense',
    label: 'Outros',
    color: 'bg-[#CFCFCF]',
    icon: HelpCircle
  },
  { 
    id: 'outros',
    name: 'Outros', 
    value: 'outros',
    type: 'expense',
    label: 'Outros',
    color: 'bg-[#CFCFCF]',
    icon: HelpCircle
  }
];
