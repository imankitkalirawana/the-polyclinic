import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Drugs from '@/components/dashboard/drugs';
import { getAllNewsletters } from './helper';
export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['newsletters'],
    queryFn: () => getAllNewsletters(),
    initialData: [],
  });
  const session = {};
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Drugs session={session} />
      </HydrationBoundary>
    </>
  );
}
