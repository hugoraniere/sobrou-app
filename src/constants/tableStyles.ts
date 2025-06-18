
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

// Z-indexes consistentes
export const TABLE_Z_INDEX = {
  STICKY_CATEGORY: 'z-30',
  TABLE_HEADER: 'z-20',
  SECTION_HEADER: 'z-10',
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
