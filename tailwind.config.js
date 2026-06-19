/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050505',
          900: '#0a0a0a',
          850: '#0f0f0f',
          800: '#141414',
          700: '#1c1c1c',
          600: '#262626',
          500: '#3a3a3a',
        },
        gold: {
          50: '#fbf6e7',
          100: '#f7ecc8',
          200: '#eed88a',
          300: '#e6c455',
          400: '#d9ad32',
          500: '#c69221',
          600: '#a9731a',
          700: '#7e5316',
          800: '#5a3b14',
          900: '#3a2610',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(217, 173, 50, 0.25), 0 20px 50px -20px rgba(217, 173, 50, 0.4)',
        'gold-glow': '0 0 40px -10px rgba(217, 173, 50, 0.55)',
        glass: '0 8px 32px -8px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f7ecc8 0%, #e6c455 35%, #c69221 70%, #7e5316 100%)',
        'gold-sheen': 'linear-gradient(110deg, transparent 25%, rgba(247, 236, 200, 0.6) 50%, transparent 75%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217, 173, 50, 0.5)' },
          '50%': { boxShadow: '0 0 30px 8px rgba(217, 173, 50, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
