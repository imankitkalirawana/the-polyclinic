import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import EditUser from '@/components/dashboard/users/edit';
import { getSubdomain } from '@/auth/sub-domain';
import { UserApi } from '@/services/common/user/user.api';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: Props) {
  const organization = await getSubdomain();
  const params = await props.params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.id],
    queryFn: async () => {
      const res = await UserApi.getByID(params.id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditUser id={params.id} organization={organization} />
    </HydrationBoundary>
  );
}
