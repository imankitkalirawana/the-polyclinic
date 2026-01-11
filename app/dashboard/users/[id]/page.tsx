import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import UserCard from '@/components/dashboard/users/user';
import { User } from '@/services/common/user';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.id],
    queryFn: async () => {
      const res = await User.getByID(params.id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserCard id={params.id} />
    </HydrationBoundary>
  );
}
