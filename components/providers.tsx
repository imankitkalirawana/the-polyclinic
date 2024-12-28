'use client';
import NextTopLoader from 'nextjs-toploader';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

const Sonner = () => {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    // Get theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    if (
      storedTheme === 'system' ||
      storedTheme === 'light' ||
      storedTheme === 'dark'
    ) {
      setTheme(storedTheme);
    }
  }, []);

  return (
    <>
      <NextTopLoader
        height={5}
        showSpinner={false}
        shadow="false"
        easing="ease"
        color="hsl(var(--nextui-primary))"
      />
      <Toaster
        toastOptions={{
          className: 'bg-background/20 backdrop-blur-md',
          style: { borderRadius: 'var(--nextui-radius-large)' },
          classNames: {
            error: 'text-danger-500 bg-danger-300/10 border-danger-300/30',
            success: 'text-success-500 bg-success-300/10 border-success-300/30',
            warning: 'text-warning-500 bg-warning-300/10 border-warning-300/30',
            info: 'text-blue-500 bg-blue-300/10 border-blue-300/30',
            closeButton:
              'hover:text-default-700 bg-background/20 border-default-500 text-slate-500 backdrop-blur-sm'
          }
        }}
        // expand
        theme={'light'}
        duration={5000}
        closeButton
      />
    </>
  );
};

export default Sonner;
