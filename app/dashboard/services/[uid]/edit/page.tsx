import ProductViewInfo from '@/components/dashboard/services/service-item';
import EditService from '@/components/dashboard/services/service-item/edit';
import { getServiceWithUID } from '@/functions/server-actions';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

interface Props {
  params: {
    uid: string;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['service', params.uid],
    queryFn: () => getServiceWithUID(params.uid)
  });
  return (
    <>
      <div className="h-full w-full px-2">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <EditService uid={params.uid} />
        </HydrationBoundary>
      </div>
    </>
  );
}
