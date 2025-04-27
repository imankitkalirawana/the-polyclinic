import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import EditUser from '@/components/dashboard/users/edit';
import { getUserWithUID } from '@/functions/server-actions';

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.uid],
    queryFn: () => getUserWithUID(params.uid),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditUser uid={params.uid} />
      </HydrationBoundary>
    </>
  );
}
