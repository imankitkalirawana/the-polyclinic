import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import Appointment from '@/components/appointments/id';
import { getAppointmentWithAID } from '@/services/api/appointment';

interface Props {
  params: {
    aid: number;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointment', params.aid],
    queryFn: async () => {
      const res = await getAppointmentWithAID(params.aid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Appointment aid={params.aid} />
      </HydrationBoundary>
    </>
  );
}
