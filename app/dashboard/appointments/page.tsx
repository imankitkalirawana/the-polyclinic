import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { AppointmentApi } from '@/services/client/appointment';
import Appointments from '@/components/dashboard/appointments/all';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await AppointmentApi.getAll();
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
