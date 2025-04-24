
import React from 'react';
import { CategoryType } from '../types/categories';
import {
  DollarSign,
  LineChart,
  Gift
} from 'lucide-react';

export const incomeCategories: CategoryType[] = [
  { 
    id: 'salary',
    name: 'Salário', 
    value: 'salary',
    type: 'income',
    label: 'Salário',
    color: 'bg-green-100 text-green-800',
    icon: DollarSign
  },
  { 
    id: 'freelance',
    name: 'Freelance', 
    value: 'freelance',
    type: 'income',
    label: 'Freelance',
    color: 'bg-blue-100 text-blue-800',
    icon: LineChart
  },
  { 
    id: 'other-income',
    name: 'Outros', 
    value: 'other-income',
    type: 'income',
    label: 'Outros',
    color: 'bg-purple-100 text-purple-800',
    icon: Gift
  }
];
