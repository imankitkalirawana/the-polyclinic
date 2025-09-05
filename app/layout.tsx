import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Providers } from './providers';

import './globals.css';

import { auth } from '@/auth';
import Navbar from '@/components/sections/navbar';
import { APP_INFO } from '@/lib/config';

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
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        <Providers session={session}>
          <NuqsAdapter>
            <Navbar />
            {children}
          </NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}
