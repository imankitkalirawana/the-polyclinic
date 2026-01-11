import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getServerSession } from '@/lib/serverAuth';
import NewUser from '@/components/dashboard/users/new';
import { getAllCountries } from '@/services/external/external.api';
import { getSubdomain } from '@/auth/sub-domain';

export default async function Page() {
  const session = await getServerSession();
  const subdomain = await getSubdomain();

  const queryClient = new QueryClient();
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

  if (!session?.user?.role) {
    return redirect('/dashboard');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewUser organization={subdomain} />
    </HydrationBoundary>
  );
}
