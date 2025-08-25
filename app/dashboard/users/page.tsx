import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Users from '@/components/dashboard/users';
import { getAllUsers } from '@/services/api/client/user';

export default async function Page() {
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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Users />
    </HydrationBoundary>
  );
}
