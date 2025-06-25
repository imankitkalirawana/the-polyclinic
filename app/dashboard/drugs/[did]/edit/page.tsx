import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import EditDrug from '@/components/dashboard/drugs/drug/edit';
import { getDrugWithDid } from '@/services/api/drug';

interface Props {
  params: {
    did: number;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drugs', params.did],
    queryFn: async () => {
      const res = await getDrugWithDid(params.did);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditDrug did={params.did} />
      </HydrationBoundary>
    </>
  );
}
