import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import EditService from '@/components/dashboard/services/service-item/edit';
import { ServiceApi } from '@/services/client/service/service.api';

interface Props {
  params: Promise<{
    uid: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['service', params.uid],
    queryFn: async () => {
      const res = await ServiceApi.getByUID(params.uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
  return (
    <div className="h-full w-full px-2">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditService uid={params.uid} />
      </HydrationBoundary>
    </div>
  );
}
