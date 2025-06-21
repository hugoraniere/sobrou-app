
import { cn } from '@/lib/utils';
import { TABLE_Z_INDEX } from '@/constants/tableStyles';

export const getCurrentMonthColumnStyle = (isCurrentMonth: boolean, additionalClasses?: string) => {
  return cn(
    isCurrentMonth && [
      "border-l border-r border-blue-500",
      TABLE_Z_INDEX.MONTH_HIGHLIGHT // Z-index baixo para que fique atrás das células de categoria
    ],
    additionalClasses
  );
};

export const getSelectedMonthColumnStyle = (isSelectedMonth: boolean, additionalClasses?: string) => {
  return cn(
    isSelectedMonth && [
      "border-l-4 border-r-4 border-blue-500",
      TABLE_Z_INDEX.MONTH_HIGHLIGHT // Z-index baixo para que fique atrás das células de categoria
    ],
    additionalClasses
  );
};
