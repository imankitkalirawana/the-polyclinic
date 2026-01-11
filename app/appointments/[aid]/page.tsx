import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Appointment from '@/components/dashboard/appointments/id';
import { AppointmentApi } from '@/services/client/appointment';

interface Props {
  params: Promise<{
    aid: string;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointment', params.aid],
    queryFn: async () => {
      const res = await AppointmentApi.getById(params.aid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Appointment aid={params.aid} />
    </HydrationBoundary>
  );
}
