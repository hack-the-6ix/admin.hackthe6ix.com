import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: '768px',
        md: '1024px',
      },
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
} satisfies Config;
