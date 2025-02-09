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
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/config';

export const getConfig = async () => {
  const res = await fetch(`${API_BASE_URL}/api/config`, {
    method: 'GET',
    headers: { Cookie: cookies().toString() }
  });
  if (res.ok) {
    const json = await res.json();
    return json.config;
  }
};

export default async function Page() {
  const session = await auth();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['config'],
    queryFn: () => getConfig()
  });

  if (!session) {
    return <UseRedirect />;
  }

  if (['doctor', 'user'].includes(session.user?.role)) {
    return <CompactView session={session} />;
  }

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TabularView session={session} />
      </HydrationBoundary>
    </>
  );
}
