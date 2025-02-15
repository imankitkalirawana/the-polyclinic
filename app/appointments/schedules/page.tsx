import { auth } from '@/auth';
import CompactView from '@/components/appointments/compact-view';
import UseRedirect from '@/hooks/useRedirect';
import React from 'react';

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <UseRedirect />;
  }

  return (
    <>
      <CompactView />
    </>
  );
}
