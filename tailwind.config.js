/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdfbf3',
          100: '#f6ecd2',
          200: '#ecdcae',
          300: '#dcc17e',
        },
        ink: {
          300: '#a8977a',
          400: '#7c6b4e',
          500: '#5c4d34',
          600: '#463a26',
          700: '#332a1b',
          900: '#241d12',
        },
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
