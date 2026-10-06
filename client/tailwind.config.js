/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        lavender: {
          50: '#FAF7FD',
          100: '#F6F1FB',
          200: '#EDE5F8',
          300: '#DFCFF4',
          400: '#C7ADEF',
          500: '#B58EED',
          600: '#9B6DE3', // Primary lavender
          700: '#834FD4',
          800: '#6C39B7',
          900: '#542698',
        },
        brand: {
          bg: '#FAF9FD',
          dark: '#171719',
          muted: '#6B6870',
          border: '#E8E3EF',
          green: '#91B79A',
          rose: '#E11D48',
        },
        primary: {
          50: '#F6F1FB',
          100: '#EDE5F8',
          500: '#B58EED',
          600: '#9B6DE3',
          700: '#834FD4',
          800: '#6C39B7',
        }
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(155, 109, 227, 0.08)',
        'card': '0 2px 12px -2px rgba(23, 23, 25, 0.04)',
      }
    },
  },
  plugins: [],
}
