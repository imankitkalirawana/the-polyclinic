import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import EditDrug from '@/components/dashboard/drugs/drug/edit';
import { getDrugWithDid } from '@/functions/server-actions/drugs';

interface Props {
  params: {
    did: number;
  };
}

const EditDrugPage = async ({ params }: Props) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drug', params.did],
    queryFn: () => getDrugWithDid(params.did),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditDrug did={params.did} />
      </HydrationBoundary>
    </>
  );
};

export default EditDrugPage;
