'use client';

import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000
      }
    }
  });
  return (
    <NextUIProvider navigate={router.push}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
