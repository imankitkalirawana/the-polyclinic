import DrugCard from '@/components/dashboard/drugs/drug';
import EditDrug from '@/components/dashboard/drugs/drug/edit';
import UserCard from '@/components/dashboard/users/user';
import { getDrugWithDid } from '@/functions/server-actions/drugs';
import { API_BASE_URL } from '@/lib/config';
import { DrugType } from '@/models/Drug';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

interface Props {
  params: {
    did: number;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['drug', params.did],
    queryFn: () => getDrugWithDid(params.did)
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditDrug did={params.did} />
      </HydrationBoundary>
    </>
  );
}
