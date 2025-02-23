'use client';

import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'nextjs-toploader/app';

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000
      }
    }
  });
  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider
        toastProps={{
          variant: 'flat',
          radius: 'lg'
        }}
      />

      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ReduxProvider store={store}>{children}</ReduxProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
