import { unauthorized } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';

import { auth } from '@/auth';
import NewDoctor from '@/components/dashboard/doctors/new';
import { getAllCountries } from '@/services/api/external';
import { getAllUsers } from '@/services/api/user';

const allowedRoles = ['admin'];

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await getAllUsers();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await getAllCountries();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    unauthorized();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewDoctor />
    </HydrationBoundary>
  );
}
