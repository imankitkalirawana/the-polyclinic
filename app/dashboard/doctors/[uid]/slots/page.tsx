import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { AppointmentScheduler } from '@/components/dashboard/doctors/doctor/slots';
import { getSlotsByUID } from '@/services/api/client/slots';

interface DoctorSlotsPageProps {
  params: Promise<{ uid: string }>;
}

export default async function DoctorSlotsPage(props: DoctorSlotsPageProps) {
  const params = await props.params;
  const uid = Number(params.uid);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['slots', uid],
    queryFn: async () => {
      const res = await getSlotsByUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppointmentScheduler uid={uid} />
    </HydrationBoundary>
  );
}
