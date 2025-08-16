
import { cn } from '@/lib/utils';

// Design tokens para padronização universal da landing page
export const LAYOUT_TOKENS = {
  // Container padrão para todas as seções
  SECTION: {
    CONTAINER: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    PADDING: 'py-16 sm:py-20 lg:py-24',
    SCROLL_OFFSET: 'scroll-mt-16'
  },
  
  // Header interno para conteúdo mais estreito
  CONTENT: {
    NARROW: 'max-w-4xl mx-auto text-center',
    HEADER_SPACING: 'mb-12 sm:mb-16'
  },
  
  // Títulos padronizados
  TITLE: {
    CLASSES: 'text-3xl md:text-4xl font-bold',
    DESCRIPTION: 'text-lg max-w-2xl mx-auto'
  },
  
  // Grid padronizado
  GRID: {
    SPACING: 'gap-6 lg:gap-8'
  },
  
  // Espaçamento das bordas
  EDGE: {
    TOP_INSET: 'mt-4 sm:mt-6 lg:mt-8'
  }
} as const;

// Função helper para seção padrão
export const getStandardSection = (additionalClasses?: string) => {
  return cn(
    'w-full',
    LAYOUT_TOKENS.SECTION.PADDING,
    LAYOUT_TOKENS.SECTION.SCROLL_OFFSET,
    additionalClasses
  );
};

// Função helper para container de seção
export const getSectionContainer = () => {
  return LAYOUT_TOKENS.SECTION.CONTAINER;
};

// Função helper para header de conteúdo
export const getContentHeader = () => {
  return cn(
    LAYOUT_TOKENS.CONTENT.NARROW,
    LAYOUT_TOKENS.CONTENT.HEADER_SPACING
  );
};

// Função helper para título padronizado
export const getStandardTitle = (additionalClasses?: string) => {
  return cn(LAYOUT_TOKENS.TITLE.CLASSES, additionalClasses);
};

// Função helper para descrição padronizada
export const getStandardDescription = (additionalClasses?: string) => {
  return cn(LAYOUT_TOKENS.TITLE.DESCRIPTION, additionalClasses);
};

// Função helper para espaçamento superior
export const getEdgeTopSpacing = () => {
  return LAYOUT_TOKENS.EDGE.TOP_INSET;
};
