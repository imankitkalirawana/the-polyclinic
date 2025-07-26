import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import DrugCard from '@/components/dashboard/drugs/drug';
import { getDrugWithDid } from '@/services/api/drug';

interface Props {
  params: Promise<{
    did: number;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const did = Number(params.did);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drug', did],
    queryFn: async () => {
      const res = await getDrugWithDid(did);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DrugCard did={did} />
    </HydrationBoundary>
  );
}
