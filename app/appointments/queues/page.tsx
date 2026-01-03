import Queues from '@/components/client/appointments/queue';
import { AppointmentQueueApi } from '@/services/client/appointment/queue/queue.api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { loadSearchParams } from './search-params';
import { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function QueuePage({ searchParams }: PageProps) {
  const { id } = await loadSearchParams(searchParams);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['queue-for-doctor', '50c99b05-f917-48ea-9f4c-d3b2701e41a2', id],
    queryFn: async () => {
      const result = await AppointmentQueueApi.getQueueForDoctor(
        '50c99b05-f917-48ea-9f4c-d3b2701e41a2',
        id
      );
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Queues />
    </HydrationBoundary>
  );
}
