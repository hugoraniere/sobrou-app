
import React from 'react';
import { CategoryType } from '../types/categories';

export const incomeCategories: CategoryType[] = [
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
