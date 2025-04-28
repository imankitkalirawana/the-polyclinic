import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getSelf } from './helper';

import Profile from '@/components/dashboard/profile';

export const metadata: Metadata = {
  title: 'Profile',
};

const ProfilePage = async () => {
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
};

export default ProfilePage;
