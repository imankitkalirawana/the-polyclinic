import Queues from '@/components/client/appointments/queue';
import { AppointmentQueueApi } from '@/services/client/appointment/queue/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function QueuePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointment-queues'],
    queryFn: async () => {
      const result = await AppointmentQueueApi.getAll();
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
