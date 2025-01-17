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
      maxWidth: {
        '8xl': '96rem'
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
        }
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'marquee-horizontal': 'marquee-x var(--duration) infinite linear',
        'marquee-vertical': 'marquee-y var(--duration) linear infinite'
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
            // background: '#E0F5E8',
            foreground: '#07170E',
            divider: '#E0F5E8'
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
            background: '#07120D',

            content1: {
              DEFAULT: '#101413'
            },
            content2: {
              DEFAULT: '#101413'
            },
            content3: {
              DEFAULT: '#111D18'
            },
            content4: {
              DEFAULT: '#11291E'
            },
            divider: '#2E2E2E'
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
