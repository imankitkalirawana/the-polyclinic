import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import DrugCard from '@/components/dashboard/drugs/drug';
import { DrugApi } from '@/services/client/drug/drug.api';

interface Props {
  params: Promise<{
    unique_id: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const unique_id = params.unique_id;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drug', unique_id],
    queryFn: async () => {
      const res = await DrugApi.getByUID(unique_id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DrugCard unique_id={unique_id} />
    </HydrationBoundary>
  );
}
