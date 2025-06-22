import { cn } from '@/lib/utils';
import { TABLE_Z_INDEX } from '@/constants/tableStyles';

// Estilo para coluna do mês atual - aplicado no header da coluna
export const getCurrentMonthColumnStyle = (isCurrentMonth: boolean, additionalClasses?: string) => {
  return cn(
    isCurrentMonth && [
      "border-l-2 border-r-2 border-blue-500 bg-blue-50",
      TABLE_Z_INDEX.MONTH_HIGHLIGHT
    ],
    additionalClasses
  );
};

// Função para células sem stroke - células individuais não têm bordas laterais
export const getCurrentMonthCellStyle = (isCurrentMonth: boolean, additionalClasses?: string) => {
  return cn(
    isCurrentMonth && "bg-blue-50", // Apenas background, sem bordas
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
