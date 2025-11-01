/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content configuration for PurgeCSS
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Enable JIT mode for smaller CSS bundles
  mode: 'jit',
  
  // Dark mode configuration
  darkMode: 'class',
  
  theme: {
    extend: {
      // Only include colors you actually use
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      // Custom animations
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  
  plugins: [
    // Only include plugins you use
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class strategy to reduce CSS size
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  
  // Safelist - classes that should never be purged
  safelist: [
    'animate-spin',
    'animate-pulse',
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    // Add any dynamically generated classes
  ],
  
  // Optimize for production
  ...(process.env.NODE_ENV === 'production' && {
    // Minimize CSS output
    important: false,
    // Prefix if needed for legacy support
    prefix: '',
  }),
};

