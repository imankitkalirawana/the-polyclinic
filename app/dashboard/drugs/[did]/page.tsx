import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import DrugCard from '@/components/dashboard/drugs/drug';
import { getDrugWithDid } from '@/functions/server-actions/drugs';

interface Props {
  params: {
    did: number;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drug', params.did],
    queryFn: () => getDrugWithDid(params.did),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DrugCard did={params.did} />
      </HydrationBoundary>
    </>
  );
}
