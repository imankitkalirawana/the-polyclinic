import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        }
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite'
      }
    }
  },
  darkMode: ['class', '[data-theme^="dark-"]'],
  plugins: [
    require('tailwindcss-animate'),
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              '50': '#eef9ef',
              '100': '#d5f0d8',
              '200': '#bde7c1',
              '300': '#a4dfab',
              '400': '#8cd694',
              '500': '#73cd7d',
              '600': '#5fa967',
              '700': '#4b8551',
              '800': '#37613b',
              '900': '#233e26',
              foreground: '#000',
              DEFAULT: '#73cd7d'
            }
          }
        },
        dark: {
          colors: {
            primary: {
              '50': '#254329',
              '100': '#3f7145',
              '200': '#599f61',
              '300': '#73cd7d',
              '400': '#93d89a',
              '500': '#b2e4b8',
              '600': '#d2efd5',
              '700': '#f1faf2',
              foreground: '#000',
              DEFAULT: '#599f61'
            }
          }
        }
      },
      layout: {
        fontSize: {
          tiny: '0.75rem',
          small: '0.875rem',
          medium: '1rem',
          large: '1.125rem'
        },
        lineHeight: {
          tiny: '1rem',
          small: '1.25rem',
          medium: '1.5rem',
          large: '1.75rem'
        },
        radius: {
          small: '0.5rem',
          medium: '0.75rem',
          large: '0.875rem'
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px'
        },
        disabledOpacity: '0.5',
        dividerWeight: '1',
        hoverOpacity: '0.9'
      }
    })
  ]
} satisfies Config;

export default config;
