import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { auth } from '@/auth';
import ServiceViewItem from '@/components/dashboard/services/service-item';
import { getServiceWithUID } from '@/functions/server-actions';
import { AuthUser } from '@/models/User';

interface Props {
  params: {
    uid: string;
  };
}

const ServicePage = async ({ params }: Props) => {
  const queryClient = new QueryClient();
  const session = await auth();

  if (!session) {
    return null;
  }

  await queryClient.prefetchQuery({
    queryKey: ['service', params.uid],
    queryFn: () => getServiceWithUID(params.uid),
  });

  return (
    <>
      <div className="h-full w-full px-2">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ServiceViewItem uid={params.uid} session={session as AuthUser} />
        </HydrationBoundary>
      </div>
    </>
  );
};

export default ServicePage;
