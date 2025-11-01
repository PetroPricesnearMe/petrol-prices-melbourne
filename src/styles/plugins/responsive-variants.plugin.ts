/**
 * Responsive Variants Plugin
 * Advanced responsive design patterns and breakpoint utilities
 */

import plugin from 'tailwindcss/plugin';

export const responsiveVariantsPlugin = plugin(function ({ addVariant, addUtilities, theme }) {
  // ========================================
  // CUSTOM RESPONSIVE VARIANTS
  // ========================================

  // Container queries
  addVariant('container-sm', '@container (min-width: 640px)');
  addVariant('container-md', '@container (min-width: 768px)');
  addVariant('container-lg', '@container (min-width: 1024px)');
  addVariant('container-xl', '@container (min-width: 1280px)');

  // Orientation variants
  addVariant('landscape', '@media (orientation: landscape)');
  addVariant('portrait', '@media (orientation: portrait)');

  // Hover variants (only on devices that support hover)
  addVariant('hover-hover', '@media (hover: hover) and (pointer: fine)');
  addVariant('hover-none', '@media (hover: none)');

  // Touch device variants
  addVariant('touch', '@media (pointer: coarse)');
  addVariant('no-touch', '@media (pointer: fine)');

  // High resolution displays
  addVariant('retina', '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');

  // Reduced motion
  addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)');
  addVariant('motion-reduce', '@media (prefers-reduced-motion: reduce)');

  // Dark mode variants
  addVariant('dark-hover', '.dark &:hover');
  addVariant('dark-focus', '.dark &:focus');
  addVariant('dark-active', '.dark &:active');

  // Print variant
  addVariant('print', '@media print');

  // Between breakpoint variants
  addVariant('sm-to-md', '@media (min-width: 640px) and (max-width: 767px)');
  addVariant('md-to-lg', '@media (min-width: 768px) and (max-width: 1023px)');
  addVariant('lg-to-xl', '@media (min-width: 1024px) and (max-width: 1279px)');

  // ========================================
  // RESPONSIVE UTILITIES
  // ========================================
  const responsiveUtilities = {
    // Mobile-first container
    '.container-fluid': {
      width: '100%',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      marginLeft: 'auto',
      marginRight: 'auto',

      '@media (min-width: 640px)': {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      },

      '@media (min-width: 1024px)': {
        paddingLeft: '2rem',
        paddingRight: '2rem',
      },

      '@media (min-width: 1280px)': {
        maxWidth: '1280px',
      },
    },

    // Responsive grid patterns
    '.grid-responsive': {
      display: 'grid',
      gap: '1rem',
      gridTemplateColumns: '1fr',

      '@media (min-width: 640px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },

      '@media (min-width: 1024px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },

      '@media (min-width: 1280px)': {
        gridTemplateColumns: 'repeat(4, 1fr)',
      },
    },

    '.grid-responsive-cards': {
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',

      '@media (min-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      },
    },

    // Responsive spacing
    '.space-y-responsive > * + *': {
      marginTop: '1rem',

      '@media (min-width: 768px)': {
        marginTop: '1.5rem',
      },

      '@media (min-width: 1024px)': {
        marginTop: '2rem',
      },
    },

    // Responsive typography
    '.text-responsive': {
      fontSize: '1rem',
      lineHeight: '1.5',

      '@media (min-width: 768px)': {
        fontSize: '1.125rem',
      },

      '@media (min-width: 1024px)': {
        fontSize: '1.25rem',
      },
    },

    '.heading-responsive': {
      fontSize: '1.5rem',
      fontWeight: '700',
      lineHeight: '1.375',

      '@media (min-width: 768px)': {
        fontSize: '1.875rem',
      },

      '@media (min-width: 1024px)': {
        fontSize: '2.25rem',
      },
    },

    // Mobile menu utilities
    '.mobile-menu': {
      '@media (max-width: 767px)': {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: '#ffffff',
        zIndex: '1050',
        padding: '1rem',
        overflowY: 'auto',
      },
    },

    // Desktop-only utilities
    '.desktop-only': {
      display: 'none',

      '@media (min-width: 1024px)': {
        display: 'block',
      },
    },

    // Mobile-only utilities
    '.mobile-only': {
      display: 'block',

      '@media (min-width: 1024px)': {
        display: 'none',
      },
    },

    // Tablet-only utilities
    '.tablet-only': {
      display: 'none',

      '@media (min-width: 768px) and (max-width: 1023px)': {
        display: 'block',
      },
    },
  };

  addUtilities(responsiveUtilities);
});

export default responsiveVariantsPlugin;
