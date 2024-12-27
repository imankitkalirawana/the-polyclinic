import SecuritySettings from '@/components/dashboard/users/edit/security-settings';
import { getUserWithUID } from '@/functions/server-actions';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.uid],
    queryFn: () => getUserWithUID(params.uid)
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SecuritySettings uid={params.uid} />
      </HydrationBoundary>
    </>
  );
}
