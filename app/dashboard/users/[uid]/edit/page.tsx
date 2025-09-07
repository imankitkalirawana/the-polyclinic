import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import EditUser from '@/components/dashboard/users/edit';
import { getSubdomain } from '@/auth/sub-domain';
import { User } from '@/services/common/user';

interface Props {
  params: Promise<{
    uid: string;
  }>;
}

export default async function Page(props: Props) {
  const organization = await getSubdomain();
  const params = await props.params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.uid],
    queryFn: async () => {
      const res = await User.getByUID(params.uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditUser uid={params.uid} organization={organization} />
    </HydrationBoundary>
  );
}
