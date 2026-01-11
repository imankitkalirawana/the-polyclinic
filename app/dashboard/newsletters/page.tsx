import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Newsletters from '@/components/dashboard/newsletters/newsletters';
import { getAllNewsletters } from '@/services/client/newsletters/newsletter.api';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      const res = await getAllNewsletters();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Newsletters />
    </HydrationBoundary>
  );
}
