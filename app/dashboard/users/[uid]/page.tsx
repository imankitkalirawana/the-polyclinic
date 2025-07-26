import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import UserCard from '@/components/dashboard/users/user';
import { getUserWithUID } from '@/services/api/user';

interface Props {
  params: Promise<{
    uid: number;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.uid],
    queryFn: async () => {
      const res = await getUserWithUID(params.uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserCard uid={params.uid} />
    </HydrationBoundary>
  );
}
