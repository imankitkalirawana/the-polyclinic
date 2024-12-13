'use client';

import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <SessionProvider>{children}</SessionProvider>
    </NextUIProvider>
  );
}
