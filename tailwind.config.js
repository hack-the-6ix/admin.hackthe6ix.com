/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#b2dbda',
          extralight: '#cce8e7',
          DEFAULT: '#23B5AF',
          dark: '#1d615e',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
