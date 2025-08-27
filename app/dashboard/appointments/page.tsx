import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Appointments from '@/components/dashboard/appointments';
import { getAllAppointments } from '@/services/api/client/appointment';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await getAllAppointments();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Appointments />
    </HydrationBoundary>
  );
}
