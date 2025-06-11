import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Appointments from '@/components/appointments/all';
import { getAllAppointments } from '../helper';

export default async function AppointmentsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointments'],
    queryFn: () => getAllAppointments(),
    initialData: [],
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Appointments />
      </HydrationBoundary>
    </>
  );
}
