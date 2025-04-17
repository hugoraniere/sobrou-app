
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
