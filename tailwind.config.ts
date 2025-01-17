import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest': {
          50: '#f3f9f3',
          100: '#e7f3e7',
          200: '#c2e0c2',
          300: '#9ecd9e',
          400: '#7ab97a',
          500: '#56a656',
          600: '#458545',
          700: '#346434',
          800: '#234223',
          900: '#112111',
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out'
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
};

export default config;
