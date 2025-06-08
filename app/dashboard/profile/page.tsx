import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import Profile from '@/components/dashboard/profile';
import { getSelf } from '@/functions/server-actions/user';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['self'],
    queryFn: () => getSelf(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile />
    </HydrationBoundary>
  );
}
