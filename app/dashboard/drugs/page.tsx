import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Drugs from '@/components/dashboard/drugs';
import { getAllDrugs } from './helper';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drugs'],
    queryFn: () => getAllDrugs(),
    initialData: [],
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Drugs />
      </HydrationBoundary>
    </>
  );
}
