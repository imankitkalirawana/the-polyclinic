import { DepartmentApi } from '@/services/client/department/department.api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Department from '@/components/dashboard/departments/department';

interface Props {
  params: Promise<{
    did: string;
  }>;
}

export default async function DepartmentPage(props: Props) {
  const params = await props.params;
  const did = params.did;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['department', did],
    queryFn: async () => {
      const res = await DepartmentApi.getByDid(did);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Department did={did} />
    </HydrationBoundary>
  );
}
