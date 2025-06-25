import NewUser from '@/components/dashboard/users/new';
import { getAllCountries } from '@/services/api/external';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await getAllCountries();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NewUser />
      </HydrationBoundary>
    </>
  );
}
