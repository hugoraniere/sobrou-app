
import { cn } from '@/lib/utils';

// Larguras padrão das colunas
export const TABLE_COLUMN_WIDTHS = {
  CATEGORY: 'min-w-[140px]',
  MONTH: 'min-w-[80px]',
  PLANNING_SPECIAL: 'min-w-[100px]', // Para coluna especial do comparativo
} as const;

// Classes de espaçamento e altura padronizadas
export const TABLE_CELL_STYLES = {
  HEADER: 'text-xs px-2 h-8',
  DATA_CELL: 'text-xs px-1 py-2',
  CATEGORY_CELL: 'text-xs px-2 py-2',
} as const;

// Z-indexes consistentes - hierarquia corrigida para mobile
export const TABLE_Z_INDEX = {
  STICKY_CATEGORY: 'z-30',  // Maior z-index para células de categoria sticky
  SECTION_HEADER: 'z-25',   // Headers das seções - AUMENTADO para ficar acima do stroke
  TABLE_HEADER: 'z-20',     // Header da tabela
  MONTH_HIGHLIGHT: 'z-5',   // Células de mês com destaque (stroke)
} as const;

// Cores de seção padronizadas
export const SECTION_COLORS = {
  REVENUE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  ESSENTIAL: {
    bg: 'bg-red-100', 
    text: 'text-red-800',
  },
  NON_ESSENTIAL: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
  },
  RESERVES: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
} as const;

// Função helper para aplicar estilos de célula consistentes
export const getTableCellClass = (type: keyof typeof TABLE_CELL_STYLES, additionalClasses?: string) => {
  return cn(TABLE_CELL_STYLES[type], additionalClasses);
};

// Função helper para aplicar larguras de coluna consistentes
export const getColumnWidthClass = (type: keyof typeof TABLE_COLUMN_WIDTHS, additionalClasses?: string) => {
  return cn(TABLE_COLUMN_WIDTHS[type], additionalClasses);
};

// Função helper para aplicar cores de seção consistentes
export const getSectionColor = (section: keyof typeof SECTION_COLORS) => {
  return SECTION_COLORS[section];
};

// Função helper para estilo de mês selecionado no cabeçalho
export const getSelectedMonthHeaderStyle = (isSelected: boolean, additionalClasses?: string) => {
  return cn(
    isSelected && "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-500",
    additionalClasses
  );
};

// Função helper para estilo de mês atual no cabeçalho
export const getCurrentMonthHeaderStyle = (isCurrent: boolean, additionalClasses?: string) => {
  return cn(
    isCurrent && "bg-blue-100 text-blue-800",
    additionalClasses
  );
};
