/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9f7',
          100: '#fdf2ee',
          200: '#fbe5d7',
          300: '#f9d1bd',
          400: '#f6bda4',
          500: '#F4C7B8', // Main brand color - warm peach
          600: '#f1a892',
          700: '#e9956f',
          800: '#d6805a',
          900: '#c26b46',
        },
        secondary: {
          50: '#f7f5fb',
          100: '#efebf7',
          200: '#ded7ef',
          300: '#cdbce6',
          400: '#bca2de',
          500: '#C8BAD8', // Secondary lavender
          600: '#a695c9',
          700: '#9481b8',
          800: '#826da6',
          900: '#705995',
        },
        accent: {
          50: '#f7f7f7',
          100: '#ebebeb',
          200: '#d4d4d4',
          300: '#b8b8b8',
          400: '#969696',
          500: '#2F2F2F', // Dark charcoal
          600: '#2a2a2a',
          700: '#242424',
          800: '#1f1f1f',
          900: '#1a1a1a',
        }
      },
      fontFamily: {
        sans: ['Tangerine', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Tangerine', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        garland: ['Tangerine', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'touch': '44px', // iOS minimum touch target
      },
      minWidth: {
        'touch': '44px', // iOS minimum touch target
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      screens: {
        'xs': '475px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}