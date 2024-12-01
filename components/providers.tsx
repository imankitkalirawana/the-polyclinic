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
      <Toaster theme={theme} richColors closeButton />
    </>
  );
};

export default Sonner;
