import { auth } from '@/auth';
import TabularView from '@/components/appointments/tabular-view';
import UseRedirect from '@/hooks/useRedirect';
import React from 'react';

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <UseRedirect />;
  }

  return (
    <>
      <TabularView session={session} />
    </>
  );
}
