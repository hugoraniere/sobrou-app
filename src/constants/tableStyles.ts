
import { cn } from '@/lib/utils';

// Larguras padronizadas das colunas - otimizadas para mobile
export const TABLE_COLUMN_WIDTHS = {
  // Coluna de categoria - otimizada
  CATEGORY_DESKTOP: 'w-[140px] min-w-[140px] max-w-[140px]',
  CATEGORY_MOBILE: 'w-[90px] min-w-[90px] max-w-[90px]', // Aumentado de 70px para 90px
  
  // Colunas de mês - otimizadas
  MONTH_DESKTOP: 'w-[70px] min-w-[70px] max-w-[70px]',
  MONTH_MOBILE: 'w-[45px] min-w-[45px] max-w-[45px]', // Reduzido de 50px para 45px
} as const;

// Classes de espaçamento e altura padronizadas
export const TABLE_CELL_STYLES = {
  HEADER: 'text-xs px-1 py-2 h-10',
  DATA_CELL: 'text-xs px-1 py-2',
  CATEGORY_CELL: 'text-xs px-2 py-2',
} as const;

// Largura mínima das tabelas otimizada para mobile
export const TABLE_MIN_WIDTH = {
  DESKTOP: '600px',
  MOBILE: '400px' // Reduzido de 480px para 400px
} as const;

// Classe para aplicar stroke na coluna de categoria inteira
export const CATEGORY_COLUMN_STROKE = 'relative after:content-[""] after:absolute after:top-0 after:right-0 after:bottom-0 after:w-[2px] after:bg-gray-300 after:z-10';

// Z-indexes consistentes - hierarquia para mobile e desktop
export const TABLE_Z_INDEX = {
  STICKY_CATEGORY: 'z-40',  // Coluna de categoria sticky
  CATEGORY_STROKE: 'z-35',  // Stroke da coluna de categoria
  SECTION_HEADER: 'z-30',   // Headers das seções
  TABLE_HEADER: 'z-25',     // Header da tabela
  MONTH_HIGHLIGHT: 'z-10',  // Células de mês com destaque
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

// Função helper para obter largura da coluna de categoria com responsividade
export const getCategoryColumnWidth = (isMobile?: boolean) => {
  return isMobile ? TABLE_COLUMN_WIDTHS.CATEGORY_MOBILE : TABLE_COLUMN_WIDTHS.CATEGORY_DESKTOP;
};

// Função helper para obter largura das colunas de mês com responsividade
export const getMonthColumnWidth = (isMobile?: boolean) => {
  return isMobile ? TABLE_COLUMN_WIDTHS.MONTH_MOBILE : TABLE_COLUMN_WIDTHS.MONTH_DESKTOP;
};

// Função helper para obter largura mínima da tabela
export const getTableMinWidth = (isMobile?: boolean) => {
  return isMobile ? TABLE_MIN_WIDTH.MOBILE : TABLE_MIN_WIDTH.DESKTOP;
};

// Função helper para aplicar estilos de célula consistentes
export const getTableCellClass = (type: keyof typeof TABLE_CELL_STYLES, additionalClasses?: string) => {
  return cn(TABLE_CELL_STYLES[type], additionalClasses);
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

// Função helper para aplicar stroke na coluna de categoria
export const getCategoryColumnStroke = (additionalClasses?: string) => {
  return cn(CATEGORY_COLUMN_STROKE, additionalClasses);
};

// Classe de container para scroll horizontal otimizado
export const getTableScrollContainer = (isMobile?: boolean) => {
  return cn(
    'overflow-x-auto',
    isMobile && 'pb-4' // Adiciona padding bottom para scroll mais confortável no mobile
  );
};
