// ============= Design System Tokens =============
// Tokens centralizados para consistência e escalabilidade

export const DESIGN_TOKENS = {
  // === CORES ===
  colors: {
    // Brand Colors
    brand: {
      primary: 'hsl(147 90% 22%)',      // Verde principal #09983D
      primaryHover: 'hsl(147 85% 32%)',  // Verde hover #0BBE4A
      primaryDark: 'hsl(147 95% 15%)',   // Verde escuro #077A31
      primaryLight: 'hsl(147 60% 95%)',  // Verde claro #E7F6EC
      accent: 'hsl(220 100% 60%)',       // Azul de destaque
    },

    // Semantic Colors
    semantic: {
      success: 'hsl(142 76% 36%)',       // Verde sucesso #22C55E
      warning: 'hsl(48 96% 53%)',        // Amarelo warning #FACC15
      error: 'hsl(0 84% 60%)',           // Vermelho erro #EF4444
      info: 'hsl(221 83% 53%)',          // Azul info #3B82F6
    },

    // Neutral Colors
    neutral: {
      white: 'hsl(0 0% 100%)',
      gray50: 'hsl(210 40% 98%)',
      gray100: 'hsl(210 40% 96%)',
      gray200: 'hsl(214 32% 91%)',
      gray300: 'hsl(213 27% 84%)',
      gray400: 'hsl(215 20% 65%)',
      gray500: 'hsl(215 16% 47%)',
      gray600: 'hsl(215 19% 35%)',
      gray700: 'hsl(215 25% 27%)',
      gray800: 'hsl(217 33% 17%)',
      gray900: 'hsl(222 47% 11%)',
      black: 'hsl(0 0% 0%)',
    },

    // Editor Specific
    editor: {
      overlay: 'hsl(0 0% 0% / 0.6)',
      overlayLight: 'hsl(0 0% 0% / 0.4)',
      placeholder: 'hsl(215 16% 47% / 0.4)',
      placeholderBorder: 'hsl(215 16% 47% / 0.25)',
      highlight: 'hsl(147 90% 22% / 0.1)',
      selection: 'hsl(147 90% 22% / 0.2)',
    }
  },

  // === TIPOGRAFIA ===
  typography: {
    fontFamily: {
      primary: ['Outfit', 'sans-serif'],
      monospace: ['Chakra Petch', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  },

  // === ESPAÇAMENTOS ===
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },

  // === BORDAS E RAIOS ===
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',
  },

  borderWidth: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },

  // === SOMBRAS ===
  shadows: {
    sm: '0 1px 2px 0 hsl(0 0% 0% / 0.05)',
    base: '0 1px 3px 0 hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)',
    md: '0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.1)',
    lg: '0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.1)',
    xl: '0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 8px 10px -6px hsl(0 0% 0% / 0.1)',
    elegant: '0 10px 30px -10px hsl(147 90% 22% / 0.3)',
    glow: '0 0 40px hsl(147 90% 32% / 0.4)',
  },

  // === TRANSIÇÕES ===
  transitions: {
    fast: 'all 0.15s ease-out',
    base: 'all 0.2s ease-out',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // === OPACIDADES ===
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
  },

  // === Z-INDEX ===
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    tooltip: '1600',
    toast: '1700',
  }
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;