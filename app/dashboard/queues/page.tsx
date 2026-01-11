import QueuesDoctorView from '@/components/dashboard/appointments/queue/views/doctor';
import { AppointmentQueueApi } from '@/services/client/appointment/queue/queue.api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { loadSearchParams } from './search-params';
import { SearchParams } from 'nuqs/server';
import { getServerSession } from '@/lib/serverAuth';
import { Role } from '@/services/common/user/user.constants';
import DefaultQueueView from '@/components/dashboard/appointments/queue/views/default';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function QueuePage({ searchParams }: PageProps) {
  const { id } = await loadSearchParams(searchParams);

  const session = await getServerSession();
  const isDoctor = session?.user?.role === Role.DOCTOR;

  const queryKey = isDoctor ? [] : ['appointment-queues', id];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      let result;
      if (isDoctor) {
        result = await AppointmentQueueApi.getQueueForDoctor(session?.user?.id, id);
      } else {
        result = await AppointmentQueueApi.getAll();
      }

      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isDoctor ? <QueuesDoctorView /> : <DefaultQueueView />}
    </HydrationBoundary>
  );
}
