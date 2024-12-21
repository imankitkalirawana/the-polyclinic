'use client';
import Error from '@/app/error';
import LoadingPage from '@/components/ui/loading-page';
import { useSession } from 'next-auth/react';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession({
    required: true
  });

  return (
    <>
      {
        // @ts-ignore
        status === 'authenticated' ? (
          <div className="mx-auto max-w-7xl px-4">{children}</div>
        ) : status === 'loading' ? (
          <LoadingPage />
        ) : (
          <Error
            code="401"
            title="Whoops, Not So Fast"
            description="You're trying to peek behind the curtain, but authorization is required. Let's set things right."
          />
        )
      }
    </>
  );
}
