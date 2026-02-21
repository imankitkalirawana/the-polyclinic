import QueuesDoctorView from '@/components/dashboard/appointments/queue/views/doctor';
import { AppointmentQueueApi } from '@/services/client/appointment/queue/queue.api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { loadSearchParams } from './search-params';
import { SearchParams } from 'nuqs/server';
import { getServerSession } from '@/libs/serverAuth';
import { UserRole } from '@/shared';
import DefaultQueueView from '@/components/dashboard/appointments/queue/views/default';
import PatientQueueView from '@/components/dashboard/appointments/queue/views/patient';
import { QueueViewType } from './types';
import QueueCalendarView from '@/components/dashboard/appointments/queue/views/calendar';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function QueuePage({ searchParams }: PageProps) {
  const { id, view, date } = await loadSearchParams(searchParams);

  const session = await getServerSession();
  const isDoctor = session?.user?.role === UserRole.DOCTOR;

  const queryKey = isDoctor
    ? ['queue-for-doctor', session?.user?.integrated_user_id, id, date]
    : ['appointment-queues'];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      let result;
      if (isDoctor) {
        result = await AppointmentQueueApi.getQueueForDoctor(
          session?.user?.integrated_user_id,
          id,
          date
        );
      } else {
        result = await AppointmentQueueApi.getAll();
      }

      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

  let ViewComponent: React.FC = DefaultQueueView;

  switch (view) {
    case QueueViewType.DEFAULT:
      switch (session?.user?.role) {
        case UserRole.DOCTOR:
          ViewComponent = QueuesDoctorView;
          break;
        case UserRole.PATIENT:
          ViewComponent = PatientQueueView;
          break;
      }
      break;
    case QueueViewType.CALENDAR:
      ViewComponent = QueueCalendarView;
      break;
    case QueueViewType.SCHEDULED:
      ViewComponent = QueuesDoctorView;
      break;
    case QueueViewType.ALL:
      ViewComponent = DefaultQueueView;
      break;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ViewComponent />
    </HydrationBoundary>
  );
}
