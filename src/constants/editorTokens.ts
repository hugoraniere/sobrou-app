// ============= Editor-Specific Tokens =============
// Tokens específicos para o editor visual

import { DESIGN_TOKENS } from './designTokens';

export const EDITOR_TOKENS = {
  // === VIEWPORT ===
  viewport: {
    desktop: {
      width: '100%',
      minHeight: '100vh',
    },
    tablet: {
      width: '768px',
      minHeight: '100vh',
    },
    mobile: {
      width: '375px',
      minHeight: '100vh',
    },
    shadow: DESIGN_TOKENS.shadows.xl,
    borderRadius: DESIGN_TOKENS.borderRadius.base,
  },

  // === TOOLBAR ===
  toolbar: {
    height: '4rem',
    background: `${DESIGN_TOKENS.colors.neutral.white} / 0.95`,
    backdropBlur: '8px',
    border: `1px solid ${DESIGN_TOKENS.colors.neutral.gray200}`,
    padding: `${DESIGN_TOKENS.spacing[3]} ${DESIGN_TOKENS.spacing[6]}`,
    gap: DESIGN_TOKENS.spacing[4],
    zIndex: DESIGN_TOKENS.zIndex.sticky,
  },

  // === INLINE EDITING ===
  inlineEdit: {
    outline: {
      color: DESIGN_TOKENS.colors.brand.primary,
      width: '2px',
      style: 'dashed',
      offset: '2px',
    },
    placeholder: {
      color: DESIGN_TOKENS.colors.editor.placeholder,
      fontStyle: 'italic',
    },
    hover: {
      background: DESIGN_TOKENS.colors.editor.highlight,
      borderRadius: DESIGN_TOKENS.borderRadius.sm,
      transition: DESIGN_TOKENS.transitions.fast,
    }
  },

  // === FORMATTING TOOLBAR ===
  formattingToolbar: {
    background: `${DESIGN_TOKENS.colors.neutral.white} / 0.98`,
    backdropBlur: '12px',
    border: `1px solid ${DESIGN_TOKENS.colors.neutral.gray200}`,
    borderRadius: DESIGN_TOKENS.borderRadius.base,
    shadow: DESIGN_TOKENS.shadows.lg,
    padding: DESIGN_TOKENS.spacing[2],
    gap: DESIGN_TOKENS.spacing[1],
    zIndex: DESIGN_TOKENS.zIndex.popover,
    minWidth: '16rem',
    
    button: {
      size: '2rem',
      borderRadius: DESIGN_TOKENS.borderRadius.sm,
      background: 'transparent',
      color: DESIGN_TOKENS.colors.neutral.gray600,
      hover: {
        background: DESIGN_TOKENS.colors.neutral.gray100,
        color: DESIGN_TOKENS.colors.neutral.gray900,
      },
      active: {
        background: DESIGN_TOKENS.colors.brand.primary,
        color: DESIGN_TOKENS.colors.neutral.white,
      }
    }
  },

  // === IMAGE PLACEHOLDER ===
  imagePlaceholder: {
    // Baseado nas imagens fornecidas pelo usuário
    background: DESIGN_TOKENS.colors.neutral.gray50,
    border: `2px dashed ${DESIGN_TOKENS.colors.neutral.gray300}`,
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    minHeight: '12rem',
    padding: DESIGN_TOKENS.spacing[8],
    
    icon: {
      size: '4rem',
      color: DESIGN_TOKENS.colors.neutral.gray400,
      marginBottom: DESIGN_TOKENS.spacing[3],
    },
    
    text: {
      primary: {
        color: DESIGN_TOKENS.colors.neutral.gray600,
        fontSize: DESIGN_TOKENS.typography.fontSize.base,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
        marginBottom: DESIGN_TOKENS.spacing[1],
      },
      secondary: {
        color: DESIGN_TOKENS.colors.neutral.gray500,
        fontSize: DESIGN_TOKENS.typography.fontSize.sm,
      }
    },
    
    hover: {
      borderColor: DESIGN_TOKENS.colors.brand.primary,
      background: DESIGN_TOKENS.colors.brand.primaryLight,
      transition: DESIGN_TOKENS.transitions.base,
    },
    
    dragOver: {
      borderColor: DESIGN_TOKENS.colors.brand.primaryHover,
      background: `${DESIGN_TOKENS.colors.brand.primary} / 0.05`,
      scale: '1.02',
    }
  },

  // === IMAGE CONTROLS ===
  imageControls: {
    overlay: {
      background: DESIGN_TOKENS.colors.editor.overlayLight,
      backdropBlur: '2px',
      borderRadius: 'inherit',
    },
    
    buttonGroup: {
      gap: DESIGN_TOKENS.spacing[2],
      padding: DESIGN_TOKENS.spacing[4],
    },
    
    button: {
      size: '2.5rem',
      borderRadius: DESIGN_TOKENS.borderRadius.base,
      background: `${DESIGN_TOKENS.colors.neutral.white} / 0.9`,
      backdropBlur: '4px',
      shadow: DESIGN_TOKENS.shadows.sm,
      hover: {
        scale: '1.1',
        shadow: DESIGN_TOKENS.shadows.md,
      }
    }
  },

  // === STATUS BAR ===
  statusBar: {
    height: '2rem',
    background: 'transparent',
    padding: `0 ${DESIGN_TOKENS.spacing[2]}`,
    
    indicator: {
      fontSize: DESIGN_TOKENS.typography.fontSize.sm,
      fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
      gap: DESIGN_TOKENS.spacing[2],
      
      variants: {
        saving: {
          color: DESIGN_TOKENS.colors.semantic.warning,
          icon: '●',
        },
        saved: {
          color: DESIGN_TOKENS.colors.semantic.success,
          icon: '✓',
        },
        error: {
          color: DESIGN_TOKENS.colors.semantic.error,
          icon: '⚠',
        }
      }
    }
  },

  // === LOADING STATES ===
  loading: {
    spinner: {
      size: '2rem',
      color: DESIGN_TOKENS.colors.brand.primary,
      strokeWidth: '2px',
    },
    
    overlay: {
      background: `${DESIGN_TOKENS.colors.neutral.white} / 0.8`,
      backdropBlur: '2px',
    },
    
    skeleton: {
      background: DESIGN_TOKENS.colors.neutral.gray200,
      shimmer: DESIGN_TOKENS.colors.neutral.gray300,
      borderRadius: DESIGN_TOKENS.borderRadius.base,
    }
  },

  // === ANIMATIONS ===
  animations: {
    fadeIn: {
      keyframes: {
        from: { opacity: '0', transform: 'translateY(10px)' },
        to: { opacity: '1', transform: 'translateY(0)' }
      },
      duration: '0.2s',
      easing: 'ease-out',
    },
    
    slideIn: {
      keyframes: {
        from: { opacity: '0', transform: 'translateX(-10px)' },
        to: { opacity: '1', transform: 'translateX(0)' }
      },
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    scaleIn: {
      keyframes: {
        from: { opacity: '0', transform: 'scale(0.95)' },
        to: { opacity: '1', transform: 'scale(1)' }
      },
      duration: '0.2s',
      easing: 'ease-out',
    }
  }
} as const;

export type EditorTokens = typeof EDITOR_TOKENS;