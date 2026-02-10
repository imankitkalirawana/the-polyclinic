import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getServerSession } from '@/libs/serverAuth';
import ServiceViewItem from '@/components/dashboard/services/service-item';
import { ServiceApi } from '@/services/client/service/service.api';

interface Props {
  params: Promise<{
    uid: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const queryClient = new QueryClient();
  const session = await getServerSession();

  if (!session) {
    return null;
  }

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
        {/* TODO: Fix this type */}
        <ServiceViewItem uid={params.uid} session={session} />
      </HydrationBoundary>
    </div>
  );
}
