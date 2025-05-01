import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Services from '@/components/dashboard/services';
import { getAllServices } from './helper';
export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['services'],
    queryFn: () => getAllServices(),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Services />
      </HydrationBoundary>
    </>
  );
}
