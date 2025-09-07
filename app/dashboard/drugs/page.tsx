import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Drugs from '@/components/dashboard/drugs';
import { getAllDrugs } from '@/services/client/drug/api';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drugs'],
    queryFn: async () => {
      const res = await getAllDrugs();
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
