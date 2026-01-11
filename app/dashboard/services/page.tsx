import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Services from '@/components/dashboard/services';
import { ServiceApi } from '@/services/client/service/service.api';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await ServiceApi.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Services />
    </HydrationBoundary>
  );
}
