import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getServerSession } from '@/libs/serverAuth';
import { getAllCountries } from '@/services/external/external.api';
import UserForm from '@/components/dashboard/users/user/form';

export default async function Page() {
  const session = await getServerSession();

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
      <UserForm />
    </HydrationBoundary>
  );
}
