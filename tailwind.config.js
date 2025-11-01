/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Dark mode configuration
  darkMode: ['class', '[data-theme="dark"]'],
  
  theme: {
    // ========================================
    // RESPONSIVE BREAKPOINTS
    // Mobile-first approach with strategic breakpoints
    // ========================================
    screens: {
      'xs': '475px',    // Extra small devices
      'sm': '640px',    // Small tablets
      'md': '768px',    // Tablets
      'lg': '1024px',   // Laptops
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Large screens
    },

    // ========================================
    // COLOR SYSTEM - WCAG AA COMPLIANT
    // All colors tested for proper contrast ratios
    // ========================================
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      
      // Primary Brand Colors - Trust & Energy
      primary: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',   // Main primary color
        700: '#1D4ED8',   // Primary hover/active
        800: '#1E40AF',
        900: '#1E3A8A',
        950: '#172554',
      },
      
      // Secondary/Success Colors - Fresh, Eco-friendly
      secondary: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',   // Main secondary color
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
        950: '#022C22',
      },
      
      // Accent Colors - Warm, Call-to-action
      accent: {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316',   // Main accent color
        600: '#EA580C',
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12',
        950: '#431407',
      },
      
      // Neutral Grays - Professional & Clean
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
        950: '#030712',
      },
      
      // Semantic Colors
      success: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
      },
      warning: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
      },
      error: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
      },
      info: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
      },
      
      // Fuel Brand Colors
      brand: {
        shell: '#E31E24',
        'shell-yellow': '#FFD700',
        bp: '#00A651',
        'bp-yellow': '#FFD700',
        caltex: '#E31E24',
        'caltex-blue': '#0066CC',
        ampol: '#E31E24',
        'ampol-blue': '#0066CC',
        'seven-eleven': '#FF6600',
        'seven-eleven-green': '#00A651',
        mobil: '#E31E24',
        'mobil-blue': '#0066CC',
        united: '#004C97',
        liberty: '#E31E24',
        metro: '#FF6B35',
        costco: '#0066B2',
      },
      
      // Fuel Type Colors
      fuel: {
        unleaded: '#22C55E',
        premium: '#EF4444',
        diesel: '#374151',
        lpg: '#3B82F6',
        e10: '#F59E0B',
        98: '#DC2626',
        95: '#F59E0B',
        91: '#1D4ED8',
      },
      
      // Essential Colors
      white: '#FFFFFF',
      black: '#000000',
    },

    // ========================================
    // SPACING SYSTEM - 8px Grid
    // Consistent spacing for better visual hierarchy
    // ========================================
    spacing: {
      0: '0',
      px: '1px',
      0.5: '0.125rem',   // 2px
      1: '0.25rem',      // 4px
      1.5: '0.375rem',   // 6px
      2: '0.5rem',       // 8px (base unit)
      2.5: '0.625rem',   // 10px
      3: '0.75rem',      // 12px
      3.5: '0.875rem',   // 14px
      4: '1rem',         // 16px
      5: '1.25rem',      // 20px
      6: '1.5rem',       // 24px
      7: '1.75rem',      // 28px
      8: '2rem',         // 32px
      9: '2.25rem',      // 36px
      10: '2.5rem',      // 40px
      11: '2.75rem',     // 44px
      12: '3rem',        // 48px
      14: '3.5rem',      // 56px
      16: '4rem',        // 64px
      20: '5rem',        // 80px
      24: '6rem',        // 96px
      28: '7rem',        // 112px
      32: '8rem',        // 128px
      36: '9rem',        // 144px
      40: '10rem',       // 160px
      44: '11rem',       // 176px
      48: '12rem',       // 192px
      52: '13rem',       // 208px
      56: '14rem',       // 224px
      60: '15rem',       // 240px
      64: '16rem',       // 256px
      72: '18rem',       // 288px
      80: '20rem',       // 320px
      96: '24rem',       // 384px
    },

    // ========================================
    // TYPOGRAPHY SCALE
    // Responsive font sizes with proper line heights
    // ========================================
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],          // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.016em' }],      // 14px
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],               // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.011em' }],     // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.014em' }],      // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.019em' }],       // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.021em' }],  // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.022em' }],    // 36px
      '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.024em' }],            // 48px
      '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],         // 60px
      '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.026em' }],          // 72px
      '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.027em' }],            // 96px
      '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.028em' }],            // 128px
    },

    fontFamily: {
      sans: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      mono: [
        'Fira Code',
        'Consolas',
        'Monaco',
        'Courier New',
        'monospace',
      ],
    },

    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    // ========================================
    // BORDER RADIUS
    // Consistent corner rounding
    // ========================================
    borderRadius: {
      none: '0',
      sm: '0.25rem',     // 4px
      DEFAULT: '0.375rem', // 6px
      md: '0.375rem',    // 6px
      lg: '0.5rem',      // 8px
      xl: '0.75rem',     // 12px
      '2xl': '1rem',     // 16px
      '3xl': '1.5rem',   // 24px
      full: '9999px',
    },

    // ========================================
    // BOX SHADOW - WCAG Compliant Elevations
    // ========================================
    boxShadow: {
      xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      glow: '0 0 20px rgb(59 130 246 / 0.4)',
      'glow-success': '0 0 20px rgb(16 185 129 / 0.4)',
      none: 'none',
    },

    // ========================================
    // TRANSITIONS & ANIMATIONS
    // Smooth, performant animations
    // ========================================
    transitionDuration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },

    transitionTimingFunction: {
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // ========================================
    // CONTAINER
    // ========================================
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },

    // ========================================
    // Z-INDEX LAYERS
    // ========================================
    zIndex: {
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      auto: 'auto',
      dropdown: '1000',
      sticky: '1020',
      fixed: '1030',
      'modal-backdrop': '1040',
      modal: '1050',
      popover: '1060',
      tooltip: '1070',
      toast: '1080',
    },

    // ========================================
    // EXTEND THEME
    // Additional customizations
    // ========================================
    extend: {
      // Background images and gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
        'gradient-overlay': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)',
        'gradient-shine': 'linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)',
      },

      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      // Line height
      lineHeight: {
        'extra-tight': '1.1',
        'tighter': '1.25',
        'tight': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },

      // Letter spacing
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },

      // Aspect ratio
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
        '4/3': '4 / 3',
        '21/9': '21 / 9',
      },

      // Max width
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      // Custom utilities for accessibility
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },

  // ========================================
  // PLUGINS
  // ========================================
  plugins: [
    // Custom plugin for component variants
    function({ addComponents, addUtilities, theme }) {
      // Add custom button variants
      addComponents({
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          fontSize: theme('fontSize.base'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('lineHeight.normal'),
          textAlign: 'center',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          border: '2px solid transparent',
          borderRadius: theme('borderRadius.xl'),
          cursor: 'pointer',
          transition: `all ${theme('transitionDuration.300')} ${theme('transitionTimingFunction.ease-in-out')}`,
          userSelect: 'none',
          minHeight: '44px',
          '&:focus-visible': {
            outline: `3px solid ${theme('colors.primary.300')}`,
            outlineOffset: '2px',
          },
          '&:disabled, &[disabled]': {
            opacity: '0.5',
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
        },
      });

      // Add accessibility utilities
      addUtilities({
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
        '.focus-ring': {
          '&:focus-visible': {
            outline: `3px solid ${theme('colors.primary.300')}`,
            outlineOffset: '2px',
          },
        },
        '.focus-ring-white': {
          '&:focus-visible': {
            outline: '3px solid white',
            outlineOffset: '2px',
          },
        },
      });
    },
  ],

  // ========================================
  // SAFELIST
  // Ensure these classes are never purged
  // ========================================
  safelist: [
    'sr-only',
    'focus-ring',
    'focus-ring-white',
  ],
};

