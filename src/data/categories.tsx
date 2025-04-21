
import React from 'react';

// Definição do tipo para categorias
export interface CategoryType {
  id: string;
  name: string;
  value: string;
  type: 'income' | 'expense';
  label: string;
  color: string;
  icon: () => JSX.Element;
}

// Categorias de receita
const incomeCategories = [
  { 
    id: 'salary',
    name: 'Salário', 
    value: 'salary',
    type: 'income',
    label: 'Salário',
    color: 'bg-green-100 text-green-800',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    )
  },
  { 
    id: 'freelance',
    name: 'Freelance', 
    value: 'freelance',
    type: 'income',
    label: 'Freelance',
    color: 'bg-blue-100 text-blue-800',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"></path>
        <path d="m19 9-5 5-4-4-3 3"></path>
      </svg>
    )
  },
  { 
    id: 'other-income',
    name: 'Outros', 
    value: 'other-income',
    type: 'income',
    label: 'Outros',
    color: 'bg-purple-100 text-purple-800',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    )
  }
];

// Categorias de despesa
const expenseCategories = [
  { 
    id: 'food',
    name: 'Alimentação', 
    value: 'food',
    type: 'expense',
    label: 'Alimentação',
    color: 'bg-red-100 text-red-800',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
    )
  },
  { 
    id: 'transport',
    name: 'Transporte', 
    value: 'transport',
    type: 'expense',
    label: 'Transporte',
    color: 'bg-orange-100 text-orange-800',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    )
  },
  { 
    id: 'utilities',
    name: 'Contas', 
    value: 'utilities',
    type: 'expense',
    label: 'Contas',
    color: 'bg-yellow-100 text-yellow-800',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
        <line x1="18" y1="12" x2="18" y2="17"></line>
      </svg>
    )
  },
  { 
    id: 'other-expense',
    name: 'Outros', 
    value: 'other-expense',
    type: 'expense',
    label: 'Outros',
    color: 'bg-gray-100 text-gray-800',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    )
  }
];

// Exportando as categorias agrupadas
export const categories = {
  income: incomeCategories,
  expense: expenseCategories
};

// Exportando uma lista plana com todas as categorias
export const transactionCategories = [
  ...incomeCategories,
  ...expenseCategories
];
