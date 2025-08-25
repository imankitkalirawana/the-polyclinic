import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Profile from '@/components/profile';
import { getSelf } from '@/services/api/client/user';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['self'],
    queryFn: async () => {
      const res = await getSelf();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile />
    </HydrationBoundary>
  );
}
