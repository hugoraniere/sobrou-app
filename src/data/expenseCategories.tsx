
import React from 'react';
import { CategoryType } from '../types/categories';
import {
  ShoppingCart,
  Car,
  Receipt,
  DollarSign
} from 'lucide-react';

export const expenseCategories: CategoryType[] = [
  { 
    id: 'food',
    name: 'Alimentação', 
    value: 'food',
    type: 'expense',
    label: 'Alimentação',
    color: 'bg-red-100 text-red-800',
    icon: ShoppingCart
  },
  { 
    id: 'transport',
    name: 'Transporte', 
    value: 'transport',
    type: 'expense',
    label: 'Transporte',
    color: 'bg-orange-100 text-orange-800',
    icon: Car
  },
  { 
    id: 'utilities',
    name: 'Contas', 
    value: 'utilities',
    type: 'expense',
    label: 'Contas',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Receipt
  },
  { 
    id: 'other-expense',
    name: 'Outros', 
    value: 'other-expense',
    type: 'expense',
    label: 'Outros',
    color: 'bg-gray-100 text-gray-800',
    icon: DollarSign
  }
];
