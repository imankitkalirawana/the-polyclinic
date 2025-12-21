import Queues from '@/components/client/appointments/queue';
import { AppointmentQueueApi } from '@/services/client/appointment/queue/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function QueuePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['queue-for-doctor', '50c99b05-f917-48ea-9f4c-d3b2701e41a2', 2],
    queryFn: async () => {
      const result = await AppointmentQueueApi.getQueueForDoctor(
        '50c99b05-f917-48ea-9f4c-d3b2701e41a2',
        '2'
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
