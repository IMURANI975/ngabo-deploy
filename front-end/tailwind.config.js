// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
 animation: {
      // ... existing animations
      'gradient-shift': 'gradientShift 3s ease infinite',
      'fade-in': 'fadeIn 0.3s ease-out',
      'slide-down': 'slideDown 0.3s ease-out',
      'slide-in-up': 'slideInUp 0.5s ease-out',
      'loading-dots': 'loadingDots 1.5s infinite',
    },
    keyframes: {
      // ... existing keyframes
      gradientShift: {
        '0%, 100%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
      },
      fadeIn: {
        from: { opacity: '0', transform: 'translateY(-10px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      slideDown: {
        from: { opacity: '0', transform: 'translateY(-10px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      slideInUp: {
        from: { opacity: '0', transform: 'translateY(30px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      loadingDots: {
        '0%, 20%': { content: '"."' },
        '40%': { content: '".."' },
        '60%, 100%': { content: '"..."' },
      }
    }
      }
    },
  },
  plugins: [],
}