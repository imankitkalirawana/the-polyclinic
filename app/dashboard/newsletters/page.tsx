import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import Newsletters from '@/components/dashboard/newsletters/newsletters';
import { getAllNewsletters } from './helper';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['newsletters'],
    queryFn: () => getAllNewsletters(),
    initialData: [],
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Newsletters />
      </HydrationBoundary>
    </>
  );
}
