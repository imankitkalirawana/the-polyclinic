import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Appointments from '@/components/dashboard/appointments';
import { getAllAppointments } from './helper';

export default async function Page() {
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
