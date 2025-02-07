import Services from '@/components/dashboard/services';
import { getAllServices } from '@/functions/server-actions/services';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['services'],
    queryFn: () => getAllServices()
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Services />
      </HydrationBoundary>
    </>
  );
}
