import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      screens: { xs: '512px' },
      maxWidth: {
        '8xl': '96rem',
        '9xl': '105rem'
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        },
        'marquee-x': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' }
        },
        'marquee-y': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' }
        },
        'card-up': {
          from: { transform: 'translateY(-40px)' },
          to: { transform: 'translateY(0)' }
        }
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'marquee-horizontal': 'marquee-x var(--duration) infinite linear',
        'marquee-vertical': 'marquee-y var(--duration) linear infinite',
        'card-up': 'card-up 0.3s ease-out'
      }
    }
  },
  darkMode: ['class', '[data-theme^="dark-"]'],
  plugins: [
    require('tailwindcss-animate'),
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: '#F4F7F5',
              100: '#E9F0EB',
              200: '#C7D9CD',
              300: '#A5C1AF',
              400: '#629374',
              500: '#1F6538',
              600: '#1C5B32',
              700: '#133D22',
              800: '#0E2D19',
              900: '#091E11',
              foreground: '#fff',
              DEFAULT: '#1F6538'
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
            },
            success: {
              '50': '#e3f7ee',
              '100': '#bbecd7',
              '200': '#93e1bf',
              '300': '#6bd6a8',
              '400': '#43cb90',
              '500': '#1bc079',
              '600': '#169e64',
              '700': '#127d4f',
              '800': '#0d5b39',
              '900': '#083a24',
              foreground: '#000',
              DEFAULT: '#1bc079'
            },
            warning: {
              '50': '#fff7e5',
              '100': '#ffebc0',
              '200': '#ffe09c',
              '300': '#ffd477',
              '400': '#ffc953',
              '500': '#ffbd2e',
              '600': '#d29c26',
              '700': '#a67b1e',
              '800': '#795a16',
              '900': '#4d390e',
              foreground: '#000',
              DEFAULT: '#ffbd2e'
            },
            danger: {
              '50': '#fde8e3',
              '100': '#fbc8bc',
              '200': '#f9a896',
              '300': '#f7886f',
              '400': '#f46848',
              '500': '#f24821',
              '600': '#c83b1b',
              '700': '#9d2f15',
              '800': '#732210',
              '900': '#49160a',
              foreground: '#000',
              DEFAULT: '#f24821'
            },
            // background: '#E0F5E8',
            foreground: '#07170E',
            divider: '#E5E7EB'
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
              50: '#FAFDFB',
              100: '#F5FCF7',
              200: '#E6F7EC',
              300: '#D7F3E1',
              400: '#B8E9CA',
              500: '#9AE0B3',
              600: '#8BCAA1',
              700: '#5C866B',
              800: '#456551',
              900: '#2E4336',
              foreground: '#000',
              DEFAULT: '#37a676'
            },
            secondary: {
              50: '#F5F8F6',
              100: '#EAF1ED',
              200: '#CBDCD1',
              300: '#ABC6B5',
              400: '#6C9C7E',
              500: '#2D7147',
              600: '#296640',
              700: '#1B442B',
              800: '#143320',
              900: '#0E2215',
              foreground: '#fff',
              DEFAULT: '#2D7147'
            },
            success: {
              '50': '#041f13',
              '100': '#073420',
              '200': '#0a492e',
              '300': '#0d5e3b',
              '400': '#438267',
              '500': '#7aa693',
              '600': '#b0cbbf',
              '700': '#e7efeb',
              foreground: '#fff',
              DEFAULT: '#0a492e'
            },
            danger: {
              '50': '#4e180b',
              '100': '#852813',
              '200': '#bb391a',
              '300': '#f14922',
              '400': '#f47254',
              '500': '#f79b85',
              '600': '#fac4b7',
              '700': '#feede9',
              foreground: '#fff',
              DEFAULT: '#bb391a'
            },
            background: '#1D1E20',
            content2: {
              DEFAULT: '#292929',
              foreground: '#fff'
            },
            content1: {
              DEFAULT: '#2D2D2D',
              foreground: '#000'
            },
            content3: {
              DEFAULT: '#676767',
              foreground: '#fff'
            },
            content4: {
              DEFAULT: '#727272',
              foreground: '#fff'
            },
            divider: '#2A2F31'
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
