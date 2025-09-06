import { Outfit } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Providers } from './providers';

import './globals.css';

import { auth } from '@/auth';
import Navbar from '@/components/sections/navbar';
import { APP_INFO } from '@/lib/config';
import { getSubdomain } from '@/auth/sub-domain';
import { toTitleCase } from '@/lib/utils';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export async function generateMetadata() {
  const subdomain = toTitleCase((await getSubdomain()) || '');
  if (subdomain) {
    return {
      title: {
        template: `%s - ${subdomain} - ${APP_INFO.name}`,
        default: `${subdomain} - ${APP_INFO.name}`,
      },
    };
  }
  return { title: { default: APP_INFO.name } };
}

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
