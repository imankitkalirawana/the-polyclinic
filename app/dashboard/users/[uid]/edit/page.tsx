import AccountDetails from '@/components/dashboard/users/edit/account-details';
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
        <AccountDetails uid={params.uid} />
      </HydrationBoundary>
    </>
  );
}
