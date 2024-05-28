import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-calm-elegant': 'linear-gradient(90deg, #A6C4C0, #D1A9B0, #7B8E8E)',
      },
      colors: {
        'calm-start': '#A6C4C0',
        'elegant-middle': '#D1A9B0',
        primaryo: '#D61F3B',
        background: '#FAFAFA',
        primaryColor: '#518581',
        secondaryColor: '#FFB23F',
        black: '#151411',
        textColor: '#AFADB5',
        'calm-end': '#7B8E8E',
        'primary-1': '#2AA8FF',
        'primary-2': '#32B6C1',
        'primary-3': '#637381',

        primary: { '50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd', '400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8', '800': '#1e40af', '900': '#1e3a8a', '950': '#172554' },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
export default config;
