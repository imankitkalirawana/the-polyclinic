import { auth } from '@/auth';
import CompactView from '@/components/appointments/compact-view';
import TabularView from '@/components/appointments/tabular-view';
import UseRedirect from '@/hooks/useRedirect';
import React from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getAllAppointments } from '@/functions/server-actions/appointment';

export default async function Page() {
  const session = await auth();
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ['appointments'],
  //   queryFn: () => getAllAppointments()
  // });

  if (!session) {
    return <UseRedirect />;
  }

  if (['doctor', 'user'].includes(session.user?.role)) {
    return <CompactView session={session} />;
  }

  return (
    <>
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <TabularView session={session} />
      {/* </HydrationBoundary> */}
    </>
  );
}
