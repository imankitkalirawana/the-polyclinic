'use client';

import React from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { useRouter } from 'nextjs-toploader/app';
import { HeroUIProvider, Spinner, ToastProvider } from '@heroui/react';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@sentry/nextjs';
import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from './get-query-client';

import { ModalProvider } from '@/components/ui/global-modal';

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

const queryClient = getQueryClient();

if (typeof window !== 'undefined') {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <HeroUIProvider navigate={router.push}>
          <ToastProvider
            toastProps={{
              variant: 'flat',
              timeout: 5000,
              shouldShowTimeoutProgress: true,
              radius: 'lg',
              classNames: {
                base: '!z-[100]',
                wrapper: '!z-[100]',
              },
            }}
            placement="top-center"
          />
          <Toaster
            icons={{
              loading: <Spinner size="sm" />,
            }}
            toastOptions={{
              // className: 'bg-background/20 backdrop-blur-md',
              style: { borderRadius: 'var(--heroui-radius-large)' },
              classNames: {
                description: '!text-[inherit]',
                toast: 'w-full max-w-sm group bg-red-500 p-2 text-tiny',
                error: '!text-danger-500 !bg-danger-50 !border-danger-100',
                success: '!text-success-500 !bg-success-50 !border-success-100',
                warning: '!text-warning-500 !bg-warning-50 !border-warning-100',
                info: '!text-info-500 !bg-info-50 !border-info-100',
                closeButton: '!-right-4 !-left-[inherit] group-hover:opacity-100 opacity-0',
              },
            }}
            expand
            theme="light"
            duration={5000}
            closeButton
          />

          <SessionProvider session={session}>
            <NextTopLoader
              height={5}
              showSpinner={false}
              shadow="false"
              easing="ease"
              color="hsl(var(--heroui-primary))"
            />
            <ModalProvider>{children}</ModalProvider>
          </SessionProvider>
        </HeroUIProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
