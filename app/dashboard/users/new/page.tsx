import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { auth } from '@/auth';
import NewUser from '@/components/dashboard/users/new';
import { getAllCountries } from '@/services/external/api';
import { getSubdomain } from '@/auth/sub-domain';

export default async function Page() {
  const session = await auth();
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

  if (!session?.user) {
    return redirect('/dashboard');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewUser organization={subdomain} />
    </HydrationBoundary>
  );
}
