
import { cn } from '@/lib/utils';
import { TABLE_Z_INDEX } from '@/constants/tableStyles';

export const getCurrentMonthColumnStyle = (isCurrentMonth: boolean, additionalClasses?: string) => {
  return cn(
    isCurrentMonth && [
      "border-l border-r border-blue-500",
      TABLE_Z_INDEX.MONTH_HIGHLIGHT
    ],
    additionalClasses
  );
};

// Nova função para células sem stroke
export const getCurrentMonthCellStyle = (isCurrentMonth: boolean, additionalClasses?: string) => {
  return cn(
    // Remove o stroke das células individuais - sem bordas laterais
    additionalClasses
  );
};

export const getSelectedMonthColumnStyle = (isSelectedMonth: boolean, additionalClasses?: string) => {
  return cn(
    isSelectedMonth && [
      "border-l-4 border-r-4 border-blue-500",
      TABLE_Z_INDEX.MONTH_HIGHLIGHT
    ],
    additionalClasses
  );
};
