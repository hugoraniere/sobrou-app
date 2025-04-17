
import React from 'react';

// Add missing className prop to components
declare module 'react' {
  interface IntrinsicAttributes {
    className?: string;
  }
}

// Add missing props for SavingGoals component
declare module '@/components/SavingGoals' {
  interface SavingGoalsProps {
    savingGoals: import('@/services/SavingsService').SavingGoal[];
    onGoalAdded: () => void;
    onGoalUpdated: () => void;
  }
}

// Add specific type declarations for components with className errors
declare module '@/components/prompt/CategorySelector' {
  interface CategorySelectorProps {
    categoryId: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onCategorySelect: (categoryId: string) => void;
    onReset: (e: React.MouseEvent) => void;
    userSelected: boolean;
    className?: string;
  }
}

