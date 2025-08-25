import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { auth } from '@/auth';
import ServiceViewItem from '@/components/dashboard/services/service-item';
import { getServiceWithUID } from '@/services/api/client/service';
import { AuthUser } from '@/types/system/control-plane';

interface Props {
  params: Promise<{
    uid: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const queryClient = new QueryClient();
  const session = await auth();

  if (!session) {
    return null;
  }

  await queryClient.prefetchQuery({
    queryKey: ['service', params.uid],
    queryFn: async () => {
      const res = await getServiceWithUID(params.uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <div className="h-full w-full px-2">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ServiceViewItem uid={params.uid} session={session as AuthUser} />
      </HydrationBoundary>
    </div>
  );
}
