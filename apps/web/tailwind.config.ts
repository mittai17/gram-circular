import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a5c38',
          dark: '#0f3d24',
          darker: '#0a2e1b',
          light: '#2d8653',
          50: '#f0f9f4',
          100: '#dcf0e4',
          200: '#bbe3cc',
          300: '#8acead',
          400: '#54b386',
          500: '#2d8653',
          600: '#1a5c38',
          700: '#154d2f',
          800: '#133e28',
          900: '#0f3421',
        },
        'primary-dark': '#0f3d24',
        'primary-darker': '#0a2e1b',
        'primary-light': '#2d8653',
        accent: '#4caf50',
        surface: '#f8faf9',
        border: '#e2e8f0',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
