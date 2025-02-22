import Newsletters from '@/components/dashboard/newsletters/newsletters';
import { getAllNewsletters } from '@/functions/server-actions/newsletters';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['newsletters'],
    queryFn: () => getAllNewsletters(),
    initialData: []
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Newsletters />
      </HydrationBoundary>
    </>
  );
}
