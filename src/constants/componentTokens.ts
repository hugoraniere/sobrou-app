// ============= Component-Specific Tokens =============
// Tokens específicos para componentes individuais

import { DESIGN_TOKENS } from './designTokens';

export const COMPONENT_TOKENS = {
  // === BOTÕES ===
  button: {
    sizes: {
      sm: {
        height: '2.25rem',      // 36px
        padding: '0.5rem 0.75rem',
        fontSize: DESIGN_TOKENS.typography.fontSize.sm,
        borderRadius: DESIGN_TOKENS.borderRadius.base,
      },
      base: {
        height: '2.5rem',       // 40px
        padding: '0.5rem 1rem',
        fontSize: DESIGN_TOKENS.typography.fontSize.base,
        borderRadius: DESIGN_TOKENS.borderRadius.md,
      },
      lg: {
        height: '2.75rem',      // 44px
        padding: '0.75rem 1.5rem',
        fontSize: DESIGN_TOKENS.typography.fontSize.lg,
        borderRadius: DESIGN_TOKENS.borderRadius.md,
      },
      xl: {
        height: '3rem',         // 48px
        padding: '0.75rem 2rem',
        fontSize: DESIGN_TOKENS.typography.fontSize.xl,
        borderRadius: DESIGN_TOKENS.borderRadius.lg,
      }
    },
    variants: {
      primary: {
        background: DESIGN_TOKENS.colors.brand.primary,
        color: DESIGN_TOKENS.colors.neutral.white,
        hover: {
          background: DESIGN_TOKENS.colors.brand.primaryHover,
        },
        active: {
          background: DESIGN_TOKENS.colors.brand.primaryDark,
        }
      },
      secondary: {
        background: DESIGN_TOKENS.colors.neutral.gray100,
        color: DESIGN_TOKENS.colors.neutral.gray900,
        hover: {
          background: DESIGN_TOKENS.colors.neutral.gray200,
        }
      },
      outline: {
        background: 'transparent',
        color: DESIGN_TOKENS.colors.brand.primary,
        border: `1px solid ${DESIGN_TOKENS.colors.brand.primary}`,
        hover: {
          background: DESIGN_TOKENS.colors.brand.primaryLight,
        }
      },
      ghost: {
        background: 'transparent',
        color: DESIGN_TOKENS.colors.neutral.gray700,
        hover: {
          background: DESIGN_TOKENS.colors.neutral.gray100,
        }
      },
      destructive: {
        background: DESIGN_TOKENS.colors.semantic.error,
        color: DESIGN_TOKENS.colors.neutral.white,
        hover: {
          background: 'hsl(0 84% 50%)',
        }
      }
    }
  },

  // === CARDS ===
  card: {
    background: DESIGN_TOKENS.colors.neutral.white,
    border: `1px solid ${DESIGN_TOKENS.colors.neutral.gray200}`,
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    shadow: DESIGN_TOKENS.shadows.sm,
    padding: {
      sm: DESIGN_TOKENS.spacing[3],
      base: DESIGN_TOKENS.spacing[4],
      lg: DESIGN_TOKENS.spacing[6],
    },
    hover: {
      shadow: DESIGN_TOKENS.shadows.md,
      borderColor: DESIGN_TOKENS.colors.brand.primary,
    }
  },

  // === INPUTS ===
  input: {
    height: '2.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: DESIGN_TOKENS.typography.fontSize.base,
    borderRadius: DESIGN_TOKENS.borderRadius.base,
    border: `1px solid ${DESIGN_TOKENS.colors.neutral.gray300}`,
    background: DESIGN_TOKENS.colors.neutral.white,
    placeholder: DESIGN_TOKENS.colors.neutral.gray500,
    focus: {
      borderColor: DESIGN_TOKENS.colors.brand.primary,
      ringColor: `${DESIGN_TOKENS.colors.brand.primary} / 0.2`,
      ringWidth: '2px',
    }
  },

  // === PLACEHOLDERS ===
  placeholder: {
    background: `${DESIGN_TOKENS.colors.neutral.gray50}`,
    border: `2px dashed ${DESIGN_TOKENS.colors.editor.placeholderBorder}`,
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    color: DESIGN_TOKENS.colors.editor.placeholder,
    padding: DESIGN_TOKENS.spacing[8],
    minHeight: '12rem',
    hover: {
      borderColor: `${DESIGN_TOKENS.colors.brand.primary} / 0.5`,
      background: `${DESIGN_TOKENS.colors.brand.primaryLight}`,
    }
  },

  // === OVERLAY ===
  overlay: {
    background: DESIGN_TOKENS.colors.editor.overlay,
    backdropBlur: '4px',
    transition: DESIGN_TOKENS.transitions.base,
  },

  // === TOOLBAR ===
  toolbar: {
    background: `${DESIGN_TOKENS.colors.neutral.white} / 0.95`,
    backdropBlur: '8px',
    border: `1px solid ${DESIGN_TOKENS.colors.neutral.gray200}`,
    borderRadius: DESIGN_TOKENS.borderRadius.base,
    shadow: DESIGN_TOKENS.shadows.lg,
    padding: DESIGN_TOKENS.spacing[2],
    gap: DESIGN_TOKENS.spacing[1],
  },

  // === STATUS INDICATORS ===
  status: {
    indicator: {
      size: '0.5rem',
      borderRadius: DESIGN_TOKENS.borderRadius.full,
    },
    variants: {
      saving: {
        color: DESIGN_TOKENS.colors.semantic.warning,
        animation: 'pulse 2s infinite',
      },
      saved: {
        color: DESIGN_TOKENS.colors.semantic.success,
      },
      error: {
        color: DESIGN_TOKENS.colors.semantic.error,
      },
      idle: {
        color: DESIGN_TOKENS.colors.neutral.gray400,
      }
    }
  },

  // === MODAL ===
  modal: {
    overlay: {
      background: 'hsl(0 0% 0% / 0.5)',
      backdropBlur: '2px',
    },
    content: {
      background: DESIGN_TOKENS.colors.neutral.white,
      borderRadius: DESIGN_TOKENS.borderRadius.xl,
      shadow: DESIGN_TOKENS.shadows.xl,
      maxWidth: '28rem',
      padding: DESIGN_TOKENS.spacing[6],
    }
  },

  // === COLOR PICKER ===
  colorPicker: {
    swatch: {
      size: '2rem',
      borderRadius: DESIGN_TOKENS.borderRadius.base,
      border: `2px solid ${DESIGN_TOKENS.colors.neutral.gray200}`,
      hover: {
        scale: '1.1',
        borderColor: DESIGN_TOKENS.colors.brand.primary,
      }
    },
    section: {
      gap: DESIGN_TOKENS.spacing[3],
      padding: DESIGN_TOKENS.spacing[4],
    }
  }
} as const;

export type ComponentTokens = typeof COMPONENT_TOKENS;