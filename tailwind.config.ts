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
      screens: { xs: '512px' },
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
            },
            secondary: {
              '50': '#e2e6df',
              '100': '#b9c4b3',
              '200': '#90a186',
              '300': '#677f5a',
              '400': '#3e5c2d',
              '500': '#153a01',
              '600': '#113001',
              '700': '#0e2601',
              '800': '#0a1c00',
              '900': '#061100',
              foreground: '#fff',
              DEFAULT: '#153a01'
            }
          }
        },
        dark: {
          colors: {
            default: {
              '50': '#121414',
              '100': '#1e2223',
              '200': '#2a2f31',
              '300': '#363d3f',
              '400': '#63696a',
              '500': '#909495',
              '600': '#bec0c1',
              '700': '#ebecec',
              foreground: '#fff',
              DEFAULT: '#2a2f31'
            },
            primary: {
              '50': '#174631',
              '100': '#277654',
              '200': '#37a676',
              '300': '#47d698',
              '400': '#70dfaf',
              '500': '#9ae8c6',
              '600': '#c3f2de',
              '700': '#edfbf5',
              foreground: '#000',
              DEFAULT: '#37a676'
            },
            background: '#081012',
            content1: {
              DEFAULT: '#1B2325',
              foreground: '#fff'
            },
            content2: {
              DEFAULT: '#1B2325',
              foreground: '#fff'
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
          small: '0.75rem',
          medium: '1rem',
          large: '1.25rem'
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
