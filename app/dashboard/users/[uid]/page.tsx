import UserCard from '@/components/dashboard/users/user';
import { getUserWithUID } from '@/services/api/user';
import { QueryClient } from '@tanstack/react-query';

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
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
    <>
      <UserCard uid={params.uid} />
    </>
  );
}
