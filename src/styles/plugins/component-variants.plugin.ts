/**
 * Component Variants Plugin
 * Advanced component variant system with dynamic styling
 */

import plugin from 'tailwindcss/plugin';

export const componentVariantsPlugin = plugin(function ({ addComponents, theme }) {
  // ========================================
  // BUTTON VARIANTS
  // ========================================
  const buttonVariants = {
    // Base button
    '.btn': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      lineHeight: '1.5',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      borderRadius: '0.75rem',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
      userSelect: 'none',
      minHeight: '44px',
      border: '2px solid transparent',

      '&:focus-visible': {
        outline: '3px solid #93C5FD',
        outlineOffset: '2px',
      },

      '&:disabled, &[disabled]': {
        opacity: '0.5',
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },

    // Button sizes
    '.btn-xs': {
      padding: `${theme('spacing.1.5')} ${theme('spacing.3')}`,
      fontSize: theme('fontSize.xs[0]'),
      minHeight: '32px',
    },
    '.btn-sm': {
      padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
      fontSize: theme('fontSize.sm[0]'),
      minHeight: '36px',
    },
    '.btn-lg': {
      padding: `${theme('spacing.4')} ${theme('spacing.8')}`,
      fontSize: theme('fontSize.lg[0]'),
      minHeight: '52px',
    },
    '.btn-xl': {
      padding: `${theme('spacing.5')} ${theme('spacing.10')}`,
      fontSize: theme('fontSize.xl[0]'),
      minHeight: '60px',
    },

    // Button variants - Primary
    '.btn-primary': {
      backgroundColor: theme('colors.primary.600'),
      color: theme('colors.white'),

      '&:hover:not(:disabled)': {
        backgroundColor: theme('colors.primary.700'),
        transform: 'translateY(-1px)',
        boxShadow: theme('boxShadow.lg'),
      },

      '&:active:not(:disabled)': {
        transform: 'translateY(0)',
      },
    },

    // Button variants - Secondary
    '.btn-secondary': {
      backgroundColor: theme('colors.secondary.600'),
      color: theme('colors.white'),

      '&:hover:not(:disabled)': {
        backgroundColor: theme('colors.secondary.700'),
        transform: 'translateY(-1px)',
        boxShadow: theme('boxShadow.lg'),
      },
    },

    // Button variants - Outline
    '.btn-outline': {
      backgroundColor: 'transparent',
      borderColor: theme('colors.primary.600'),
      color: theme('colors.primary.600'),

      '&:hover:not(:disabled)': {
        backgroundColor: theme('colors.primary.50'),
        borderColor: theme('colors.primary.700'),
      },
    },

    // Button variants - Ghost
    '.btn-ghost': {
      backgroundColor: 'transparent',
      color: theme('colors.gray.700'),

      '&:hover:not(:disabled)': {
        backgroundColor: theme('colors.gray.100'),
      },
    },

    // Button variants - Gradient
    '.btn-gradient': {
      background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
      color: theme('colors.white'),
      border: 'none',

      '&:hover:not(:disabled)': {
        opacity: '0.9',
        transform: 'translateY(-1px)',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
      },
    },
  };

  // ========================================
  // CARD VARIANTS
  // ========================================
  const cardVariants = {
    '.card': {
      backgroundColor: theme('colors.white'),
      borderRadius: theme('borderRadius.2xl'),
      boxShadow: theme('boxShadow.sm'),
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },

    '.card-hover': {
      backgroundColor: theme('colors.white'),
      borderRadius: theme('borderRadius.2xl'),
      boxShadow: theme('boxShadow.sm'),
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',

      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme('boxShadow.xl'),
      },
    },

    '.card-elevated': {
      backgroundColor: theme('colors.white'),
      borderRadius: theme('borderRadius.2xl'),
      boxShadow: theme('boxShadow.lg'),
      overflow: 'hidden',
    },

    '.card-bordered': {
      backgroundColor: theme('colors.white'),
      borderRadius: theme('borderRadius.2xl'),
      border: `1px solid ${theme('colors.gray.200')}`,
      overflow: 'hidden',
    },

    '.card-glass': {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: theme('borderRadius.2xl'),
      border: `1px solid ${theme('colors.gray.200')}`,
      overflow: 'hidden',
    },
  };

  // ========================================
  // INPUT VARIANTS
  // ========================================
  const inputVariants = {
    '.input': {
      width: '100%',
      padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
      fontSize: theme('fontSize.base[0]'),
      lineHeight: theme('lineHeight.normal'),
      color: theme('colors.gray.900'),
      backgroundColor: theme('colors.white'),
      border: `2px solid ${theme('colors.gray.300')}`,
      borderRadius: theme('borderRadius.lg'),
      transition: 'all 0.2s ease',

      '&:focus': {
        outline: 'none',
        borderColor: theme('colors.primary.500'),
        boxShadow: `0 0 0 3px ${theme('colors.primary.100')}`,
      },

      '&:disabled': {
        backgroundColor: theme('colors.gray.100'),
        cursor: 'not-allowed',
      },

      '&::placeholder': {
        color: theme('colors.gray.400'),
      },
    },

    '.input-sm': {
      padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
      fontSize: theme('fontSize.sm[0]'),
    },

    '.input-lg': {
      padding: `${theme('spacing.4')} ${theme('spacing.5')}`,
      fontSize: theme('fontSize.lg[0]'),
    },

    '.input-error': {
      borderColor: theme('colors.error.500'),

      '&:focus': {
        borderColor: theme('colors.error.600'),
        boxShadow: `0 0 0 3px ${theme('colors.error.100')}`,
      },
    },

    '.input-success': {
      borderColor: theme('colors.success.500'),

      '&:focus': {
        borderColor: theme('colors.success.600'),
        boxShadow: `0 0 0 3px ${theme('colors.success.100')}`,
      },
    },
  };

  // ========================================
  // BADGE VARIANTS
  // ========================================
  const badgeVariants = {
    '.badge': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      padding: `${theme('spacing.1')} ${theme('spacing.2.5')}`,
      fontSize: theme('fontSize.xs[0]'),
      fontWeight: theme('fontWeight.semibold'),
      lineHeight: theme('lineHeight.tight'),
      borderRadius: theme('borderRadius.full'),
    },

    '.badge-primary': {
      backgroundColor: theme('colors.primary.100'),
      color: theme('colors.primary.800'),
    },

    '.badge-secondary': {
      backgroundColor: theme('colors.secondary.100'),
      color: theme('colors.secondary.800'),
    },

    '.badge-success': {
      backgroundColor: theme('colors.success.100'),
      color: theme('colors.success.800'),
    },

    '.badge-warning': {
      backgroundColor: theme('colors.warning.100'),
      color: theme('colors.warning.800'),
    },

    '.badge-error': {
      backgroundColor: theme('colors.error.100'),
      color: theme('colors.error.800'),
    },

    '.badge-outline': {
      backgroundColor: 'transparent',
      border: `1px solid ${theme('colors.gray.300')}`,
      color: theme('colors.gray.700'),
    },
  };

  // ========================================
  // ALERT VARIANTS
  // ========================================
  const alertVariants = {
    '.alert': {
      display: 'flex',
      padding: theme('spacing.4'),
      borderRadius: theme('borderRadius.xl'),
      gap: theme('spacing.3'),
    },

    '.alert-info': {
      backgroundColor: theme('colors.info.50'),
      color: theme('colors.info.900'),
      borderLeft: `4px solid ${theme('colors.info.500')}`,
    },

    '.alert-success': {
      backgroundColor: theme('colors.success.50'),
      color: theme('colors.success.900'),
      borderLeft: `4px solid ${theme('colors.success.500')}`,
    },

    '.alert-warning': {
      backgroundColor: theme('colors.warning.50'),
      color: theme('colors.warning.900'),
      borderLeft: `4px solid ${theme('colors.warning.500')}`,
    },

    '.alert-error': {
      backgroundColor: theme('colors.error.50'),
      color: theme('colors.error.900'),
      borderLeft: `4px solid ${theme('colors.error.500')}`,
    },
  };

  // Add all component variants
  addComponents({
    ...buttonVariants,
    ...cardVariants,
    ...inputVariants,
    ...badgeVariants,
    ...alertVariants,
  });
});

export default componentVariantsPlugin;
