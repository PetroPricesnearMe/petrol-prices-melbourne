/**
 * Tailwind CSS Configuration
 * Comprehensive design system with theming support
 * 
 * @see https://tailwindcss.com/docs/configuration
 */

import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Dark mode configuration - uses class strategy
  darkMode: 'class',
  
  theme: {
    extend: {
      // ============================================================
      // COLOR PALETTE
      // ============================================================
      colors: {
        // Primary Brand Color (Blue)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Main primary
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Secondary Color (Indigo/Purple)
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',  // Main secondary
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        
        // Accent Color (Teal/Cyan)
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',  // Main accent
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        
        // Neutral Grays (Extended)
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        
        // Success (Green)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Main success
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        
        // Warning (Amber/Orange)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Main warning
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        
        // Error/Danger (Red)
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Main error
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        
        // Info (Blue)
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Main info
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },

      // ============================================================
      // SPACING SCALE
      // ============================================================
      spacing: {
        '0.5': '0.125rem',    // 2px
        '1.5': '0.375rem',    // 6px
        '2.5': '0.625rem',    // 10px
        '3.5': '0.875rem',    // 14px
        '4.5': '1.125rem',    // 18px
        '5.5': '1.375rem',    // 22px
        '6.5': '1.625rem',    // 26px
        '7.5': '1.875rem',    // 30px
        '15': '3.75rem',      // 60px
        '17': '4.25rem',      // 68px
        '18': '4.5rem',       // 72px
        '19': '4.75rem',      // 76px
        '21': '5.25rem',      // 84px
        '22': '5.5rem',       // 88px
        '26': '6.5rem',       // 104px
        '30': '7.5rem',       // 120px
        '34': '8.5rem',       // 136px
        '38': '9.5rem',       // 152px
        '42': '10.5rem',      // 168px
        '46': '11.5rem',      // 184px
        '50': '12.5rem',      // 200px
        '68': '17rem',        // 272px
        '72': '18rem',        // 288px
        '80': '20rem',        // 320px
        '88': '22rem',        // 352px
        '96': '24rem',        // 384px
        '104': '26rem',       // 416px
        '112': '28rem',       // 448px
        '120': '30rem',       // 480px
        '128': '32rem',       // 512px
        '136': '34rem',       // 544px
        '144': '36rem',       // 576px
        '152': '38rem',       // 608px
        '160': '40rem',       // 640px
        '168': '42rem',       // 672px
        '176': '44rem',       // 704px
        '184': '46rem',       // 736px
        '192': '48rem',       // 768px
        '200': '50rem',       // 800px
      },

      // ============================================================
      // BORDER RADIUS SCALE
      // ============================================================
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',      // 4px
        DEFAULT: '0.375rem',  // 6px
        'md': '0.5rem',       // 8px
        'lg': '0.75rem',      // 12px
        'xl': '1rem',         // 16px
        '2xl': '1.25rem',     // 20px
        '3xl': '1.5rem',      // 24px
        '4xl': '2rem',        // 32px
        '5xl': '2.5rem',      // 40px
        'full': '9999px',
      },

      // ============================================================
      // TYPOGRAPHY
      // ============================================================
      fontSize: {
        // Base sizes
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],         // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],    // 14px
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],              // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],   // 18px
        'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],    // 20px
        
        // Heading sizes
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em', fontWeight: '700' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '700' }],  // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em', fontWeight: '800' }],   // 36px
        '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.03em', fontWeight: '800' }],       // 48px
        '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.035em', fontWeight: '900' }],     // 60px
        '7xl': ['4.5rem', { lineHeight: '4.5rem', letterSpacing: '-0.04em', fontWeight: '900' }],     // 72px
        '8xl': ['6rem', { lineHeight: '6rem', letterSpacing: '-0.045em', fontWeight: '900' }],        // 96px
        '9xl': ['8rem', { lineHeight: '8rem', letterSpacing: '-0.05em', fontWeight: '900' }],         // 128px
      },

      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
        display: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
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

      // ============================================================
      // BOX SHADOWS
      // ============================================================
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        
        // Custom shadows
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.2), 0 20px 60px -10px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
      },

      // ============================================================
      // ANIMATIONS
      // ============================================================
      animation: {
        // Fade
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        
        // Slide
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        
        // Scale
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        
        // Bounce
        'bounce-in': 'bounceIn 0.5s ease-out',
        
        // Spin (slower than default)
        'spin-slow': 'spin 3s linear infinite',
        'spin-slower': 'spin 5s linear infinite',
        
        // Pulse
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        
        // Custom
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },

      keyframes: {
        // Fade
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        
        // Slide
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        
        // Scale
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        
        // Bounce
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        
        // Custom
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      // ============================================================
      // TRANSITIONS
      // ============================================================
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '750': '750ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
      },

      // ============================================================
      // Z-INDEX SCALE
      // ============================================================
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'auto': 'auto',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },

      // ============================================================
      // TYPOGRAPHY PLUGIN
      // ============================================================
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            h1: {
              fontWeight: '800',
              color: theme('colors.gray.900'),
            },
            h2: {
              fontWeight: '700',
              color: theme('colors.gray.900'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.900'),
            },
            code: {
              color: theme('colors.primary.600'),
              fontWeight: '500',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            code: {
              color: theme('colors.primary.400'),
            },
          },
        },
      }),
    },
  },
  
  // ============================================================
  // PLUGINS
  // ============================================================
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
