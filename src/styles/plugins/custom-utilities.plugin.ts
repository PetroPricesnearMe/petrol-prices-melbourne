/**
 * Custom Tailwind CSS Utilities Plugin
 * Advanced utility classes for enhanced styling capabilities
 */

import plugin from 'tailwindcss/plugin';

export const customUtilitiesPlugin = plugin(function ({ addUtilities, theme }) {
  // ========================================
  // TEXT & TYPOGRAPHY UTILITIES
  // ========================================
  const textUtilities = {
    // Text balance for better typography
    '.text-balance': {
      textWrap: 'balance',
    },
    '.text-pretty': {
      textWrap: 'pretty',
    },

    // Truncation utilities
    '.truncate-2': {
      display: '-webkit-box',
      '-webkit-line-clamp': '2',
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
    },
    '.truncate-3': {
      display: '-webkit-box',
      '-webkit-line-clamp': '3',
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
    },
    '.truncate-4': {
      display: '-webkit-box',
      '-webkit-line-clamp': '4',
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
    },

    // Gradient text
    '.text-gradient': {
      backgroundClip: 'text',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
    },
    '.text-gradient-primary': {
      backgroundClip: 'text',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      backgroundImage: theme('backgroundImage.gradient-primary'),
    },
    '.text-gradient-secondary': {
      backgroundClip: 'text',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      backgroundImage: theme('backgroundImage.gradient-secondary'),
    },
  };

  // ========================================
  // LAYOUT UTILITIES
  // ========================================
  const layoutUtilities = {
    // Centered flex layouts
    '.flex-center': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.flex-between': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    '.flex-around': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    '.flex-evenly': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },

    // Grid utilities
    '.grid-auto-fill': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: theme('spacing.4'),
    },
    '.grid-auto-fit': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: theme('spacing.4'),
    },

    // Aspect ratios
    '.aspect-video-cover': {
      aspectRatio: '16 / 9',
      objectFit: 'cover',
    },
    '.aspect-square-cover': {
      aspectRatio: '1 / 1',
      objectFit: 'cover',
    },
  };

  // ========================================
  // EFFECTS & VISUAL UTILITIES
  // ========================================
  const effectUtilities = {
    // Glass morphism
    '.glass': {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      '-webkit-backdrop-filter': 'blur(10px)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    },
    '.glass-dark': {
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      '-webkit-backdrop-filter': 'blur(10px)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },

    // Glow effects
    '.glow-primary': {
      boxShadow: `0 0 20px ${theme('colors.primary.500')}40`,
    },
    '.glow-secondary': {
      boxShadow: `0 0 20px ${theme('colors.secondary.500')}40`,
    },
    '.glow-success': {
      boxShadow: `0 0 20px ${theme('colors.success.500')}40`,
    },

    // Shimmer effect
    '.shimmer': {
      background:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s infinite',
    },

    // Smooth scrolling
    '.scroll-smooth': {
      scrollBehavior: 'smooth',
      '-webkit-overflow-scrolling': 'touch',
    },

    // Hide scrollbar
    '.scrollbar-hide': {
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },

    // Custom scrollbar
    '.scrollbar-custom': {
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: theme('colors.gray.100'),
        borderRadius: theme('borderRadius.lg'),
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme('colors.gray.400'),
        borderRadius: theme('borderRadius.lg'),
        '&:hover': {
          background: theme('colors.gray.500'),
        },
      },
    },
  };

  // ========================================
  // INTERACTION UTILITIES
  // ========================================
  const interactionUtilities = {
    // Disable interactions
    '.no-interaction': {
      pointerEvents: 'none',
      userSelect: 'none',
    },

    // Touch target sizing (WCAG)
    '.touch-target': {
      minWidth: '44px',
      minHeight: '44px',
    },

    // Tap highlight
    '.tap-highlight-none': {
      '-webkit-tap-highlight-color': 'transparent',
    },

    // Hardware acceleration
    '.gpu-accelerate': {
      transform: 'translateZ(0)',
      '-webkit-transform': 'translateZ(0)',
      willChange: 'transform',
    },
  };

  // ========================================
  // ACCESSIBILITY UTILITIES
  // ========================================
  const a11yUtilities = {
    // Focus visible styles
    '.focus-primary': {
      '&:focus-visible': {
        outline: `3px solid ${theme('colors.primary.500')}`,
        outlineOffset: '2px',
      },
    },
    '.focus-secondary': {
      '&:focus-visible': {
        outline: `3px solid ${theme('colors.secondary.500')}`,
        outlineOffset: '2px',
      },
    },

    // Screen reader only
    '.sr-only-focusable': {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
      '&:active, &:focus': {
        position: 'static',
        width: 'auto',
        height: 'auto',
        overflow: 'visible',
        clip: 'auto',
        whiteSpace: 'normal',
      },
    },

    // Reduced motion support
    '.motion-safe': {
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        transition: 'none',
      },
    },
  };

  // ========================================
  // PRINT UTILITIES
  // ========================================
  const printUtilities = {
    '.print-hidden': {
      '@media print': {
        display: 'none',
      },
    },
    '.print-only': {
      display: 'none',
      '@media print': {
        display: 'block',
      },
    },
    '.print-break-before': {
      '@media print': {
        pageBreakBefore: 'always',
      },
    },
    '.print-break-after': {
      '@media print': {
        pageBreakAfter: 'always',
      },
    },
    '.print-avoid-break': {
      '@media print': {
        pageBreakInside: 'avoid',
      },
    },
  };

  // Add all utilities
  addUtilities({
    ...textUtilities,
    ...layoutUtilities,
    ...effectUtilities,
    ...interactionUtilities,
    ...a11yUtilities,
    ...printUtilities,
  });
});

export default customUtilitiesPlugin;
