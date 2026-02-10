import { TailwindConfig } from '@react-email/components';

const config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        muted: '#d4d4d8',
        brand: '#1F6538',
        success: '#1BC079',
        warning: '#FFBD2F',
        danger: '#F34822',
      },
      borderRadius: {
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
      },
    },
  },
} as TailwindConfig;

export default config;
