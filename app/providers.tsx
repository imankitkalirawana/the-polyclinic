'use client';

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { useRouter } from 'nextjs-toploader/app';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider
        toastProps={{
          variant: 'flat',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          radius: 'lg',
          classNames: {
            base: '!z-[100]',
            wrapper: '!z-[100]',
          },
        }}
      />

      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <NextTopLoader
            height={5}
            showSpinner={false}
            shadow="false"
            easing="ease"
            color="hsl(var(--heroui-primary))"
          />
          <ReduxProvider store={store}>{children}</ReduxProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
