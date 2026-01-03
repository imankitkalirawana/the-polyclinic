import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Doctors from '@/components/dashboard/doctors';
import { Doctor } from '@/services/client/doctor/doctor.api';

export default async function DoctorsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await Doctor.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Doctors />
    </HydrationBoundary>
  );
}
