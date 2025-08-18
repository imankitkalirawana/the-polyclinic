import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Providers } from './providers';

import './globals.css';

import Navbar from '@/components/sections/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { APP_INFO } from '@/lib/config';
import { SessionProvider } from './session-provider';
import { getSession } from '@/auth/session';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: {
    template: `%s - ${APP_INFO.name}`,
    default: APP_INFO.name,
  },
  description: APP_INFO.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={outfit.className}>
        <SessionProvider session={session?.session} user={session?.user}>
          <Providers>
            <NuqsAdapter>
              <ThemeProvider attribute="class" defaultTheme="light">
                <Navbar />
                {children}
              </ThemeProvider>
            </NuqsAdapter>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
