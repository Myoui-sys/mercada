import type { Config } from 'tailwindcss';

/**
 * Tokens de design do simulador.
 *
 * Paleta pensada para fugir do "clichê IA" de fundo creme + terracota:
 * base neutra fria (quase cinza-azulado), tinta quase-preta para texto e
 * um dourado-âmbar de ação (compra/carrinho) que não copia o laranja
 * característico de nenhuma marca específica.
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101827',
        surface: '#FFFFFF',
        canvas: '#F4F5F7',
        muted: '#6B7280',
        border: '#E3E5EA',
        accent: {
          DEFAULT: '#E8A93A',
          dark: '#C98A1F',
          light: '#FCE8C2',
        },
        success: '#2F9E44',
        danger: '#E03131',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: '4px',
      },
    },
  },
  plugins: [],
};

export default config;
