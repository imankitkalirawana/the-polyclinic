import AppointmentQueue from '@/components/dashboard/appointments/queue/aid';
import { AppointmentQueueApi } from '@/services/client/appointment/queue/queue.api';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    aid: string;
  }>;
}

export default async function AppointmentQueuePage({ params }: PageProps) {
  const { aid } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointment-queue-with-aid', aid],
    queryFn: async () => {
      const res = await AppointmentQueueApi.getQueueByAid(aid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppointmentQueue aid={aid} />
    </HydrationBoundary>
  );
}
