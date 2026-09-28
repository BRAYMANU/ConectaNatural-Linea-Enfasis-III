/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        botanic: {
          50: '#f0f9f1',
          100: '#dcf0de',
          200: '#bae0bf',
          300: '#8ac893',
          400: '#5eaa6b',
          500: '#3c8c4c',
          600: '#2d7039',
          700: '#255a2f',
          800: '#1f4828',
          900: '#1a3b22',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
