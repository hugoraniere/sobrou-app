
import { cn } from '@/lib/utils';

// Design tokens para padronização de layout
export const LAYOUT_TOKENS = {
  // Container padrão responsivo
  CONTAINER: {
    DESKTOP: 'container mx-auto max-w-screen-xl',
    MOBILE: 'px-4',
    FULL_WIDTH: 'w-full'
  },
  
  // Header spacing padrão
  HEADER: {
    SPACING: 'mt-6 mb-6',
    MOBILE_SPACING: 'mt-6 mb-6' // Mantém consistência
  },
  
  // Títulos responsivos
  TITLE: {
    DESKTOP: 'text-3xl',
    MOBILE: 'text-2xl',
    BASE_CLASSES: 'font-bold text-gray-900'
  },
  
  // Descrições padrão
  DESCRIPTION: {
    BASE_CLASSES: 'text-gray-600'
  },
  
  // Breakpoints otimizados
  BREAKPOINTS: {
    MOBILE_MAX: 768,
    TABLET_MAX: 1024
  }
} as const;

// Função helper para container responsivo universal
export const getResponsiveContainer = (isMobile?: boolean) => {
  return cn(
    LAYOUT_TOKENS.CONTAINER.FULL_WIDTH,
    isMobile 
      ? LAYOUT_TOKENS.CONTAINER.MOBILE 
      : LAYOUT_TOKENS.CONTAINER.DESKTOP
  );
};

// Função helper para título responsivo universal
export const getResponsiveTitle = (isMobile?: boolean, additionalClasses?: string) => {
  return cn(
    LAYOUT_TOKENS.TITLE.BASE_CLASSES,
    isMobile 
      ? LAYOUT_TOKENS.TITLE.MOBILE 
      : LAYOUT_TOKENS.TITLE.DESKTOP,
    additionalClasses
  );
};

// Função helper para header spacing
export const getHeaderSpacing = () => {
  return LAYOUT_TOKENS.HEADER.SPACING;
};

// Função helper para descrição padrão
export const getDescriptionClasses = (additionalClasses?: string) => {
  return cn(LAYOUT_TOKENS.DESCRIPTION.BASE_CLASSES, additionalClasses);
};
