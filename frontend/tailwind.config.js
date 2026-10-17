/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060709',
          900: '#0A0B0E',
          850: '#111318',
          800: '#161922',
          700: '#1F2430',
          600: '#2A3040',
        },
        gold: {
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#EAB308',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        charcoal: {
          100: '#F1F5F9',
          200: '#E2E8F0',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #D97706 50%, #92400E 100%)',
        'gold-gradient-subtle': 'linear-gradient(135deg, rgba(253, 230, 138, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
        'dark-card': 'linear-gradient(180deg, rgba(22, 25, 34, 0.85) 0%, rgba(17, 19, 24, 0.95) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(217, 119, 6, 0.3)',
        'gold-glow-lg': '0 0 40px -5px rgba(217, 119, 6, 0.45)',
      }
    },
  },
  plugins: [],
}
