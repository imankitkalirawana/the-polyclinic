import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { AppointmentScheduler } from '@/components/dashboard/doctors/doctor/slots';
import { DoctorSlots } from '@/services/client/doctor';

interface DoctorSlotsPageProps {
  params: Promise<{ uid: string }>;
}

export default async function DoctorSlotsPage(props: DoctorSlotsPageProps) {
  const params = await props.params;
  const uid = params.uid;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['slots', uid],
    queryFn: async () => {
      const res = await DoctorSlots.getSlotsByUID(uid);
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
