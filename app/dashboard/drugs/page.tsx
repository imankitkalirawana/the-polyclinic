import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Drugs from '@/components/dashboard/drugs';
import { DrugApi } from '@/services/client/drug/drug.api';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drugs'],
    queryFn: async () => {
      const res = await DrugApi.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Drugs />
    </HydrationBoundary>
  );
}
