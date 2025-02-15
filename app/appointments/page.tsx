import { auth } from '@/auth';
import CompactView from '@/components/appointments/compact-view';
import TabularView from '@/components/appointments/tabular-view';
import UseRedirect from '@/hooks/useRedirect';
import React from 'react';

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <UseRedirect />;
  }

  if (['doctor', 'user', 'receptionist'].includes(session.user?.role)) {
    return <CompactView session={session} />;
  }

  return (
    <>
      <TabularView session={session} />
    </>
  );
}
