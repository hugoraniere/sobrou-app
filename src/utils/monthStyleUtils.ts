
import { cn } from '@/lib/utils';

export const getCurrentMonthColumnStyle = (isCurrentMonth: boolean, additionalClasses?: string) => {
  return cn(
    isCurrentMonth && "border-l-2 border-r-2 border-blue-500",
    additionalClasses
  );
};

export const getSelectedMonthColumnStyle = (isSelectedMonth: boolean, additionalClasses?: string) => {
  return cn(
    isSelectedMonth && "border-l-4 border-r-4 border-blue-500",
    additionalClasses
  );
};
