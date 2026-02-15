import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import UserForm from '@/components/dashboard/users/user/form';
import { UserApi } from '@/services/common/user/user.api';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user-profile', params.id],
    queryFn: async () => {
      const res = await UserApi.getUserProfile(params.id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserForm id={params.id} />
    </HydrationBoundary>
  );
}
