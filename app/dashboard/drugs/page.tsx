import Drugs from '@/components/dashboard/drugs';
import { getAllDrugs } from '@/functions/server-actions/drugs';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drugs'],
    queryFn: () => getAllDrugs()
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Drugs />
      </HydrationBoundary>
    </>
  );
}
