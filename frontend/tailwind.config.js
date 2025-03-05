/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // УВАГА! Проблема контрасту:
        // Відтінки dark-700 до dark-950 дуже схожі і не дають достатнього контрасту
        // Для контрастного дизайну використовуйте:
        // - Темні фони: dark-950, dark-900, dark-800
        // - Середні фони: dark-700, dark-600
        // - Світлі фони і акценти: dark-500, dark-400
        // - Для тексту на темному фоні: dark-100, dark-50, білий
        dark: {
          50: '#A3A3A3',  // найсвітліший відтінок
          100: '#8A8A8A',
          200: '#737373',
          300: '#5C5C5C',
          400: '#454545',
          500: '#363636',
          600: '#282828',
          700: '#1F1F1F',
          800: '#171717',
          900: '#0F0F0F',
          950: '#090909',  // найтемніший відтінок, майже чорний
        },
        // Додаємо відтінки для тла та інтерфейсу
        background: {
          DEFAULT: '#0F0F0F',
          subtle: '#171717',
          hover: '#1F1F1F',
        },
        // Для акцентів на темному фоні
        accent: {
          DEFAULT: '#B3B3B3',
          hover: '#CDCDCD',
          bright: '#E5E5E5',
        },
        border: {
          DEFAULT: '#282828',
          subtle: '#1F1F1F',
          highlight: '#363636',
        },
        // Кольори для сповіщень
        error: {
          DEFAULT: '#FF3B30',  // Яскравий червоний
          light: '#FF6B61',
          dark: '#D32F2F',
          hover: '#FF1F12',
        },
        success: {
          DEFAULT: '#34C759',  // Зелений
          light: '#5AD57A',
          dark: '#2A9D47',
          hover: '#28A745',
        },
        warning: {
          DEFAULT: '#FF9500',  // Помаранчевий
          light: '#FFB143',
          dark: '#CC7A00',
          hover: '#E68600',
        },
        info: {
          DEFAULT: '#5AC8FA',  // Блакитний
          light: '#7DD5FB',
          dark: '#2884A7',
          hover: '#42BEFA',
        }
      },
    },
  },
  plugins: [],
} 