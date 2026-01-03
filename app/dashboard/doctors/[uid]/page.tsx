import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import DashboardDoctor from '@/components/dashboard/doctors/doctor';
import { Doctor } from '@/services/client/doctor/doctor.api';

interface Props {
  params: Promise<{
    uid: string;
  }>;
}

export default async function DashboardDoctorPage(props: Props) {
  const params = await props.params;
  const uid = params.uid;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['doctor', uid],
    queryFn: async () => {
      const res = await Doctor.getByUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardDoctor uid={uid} />
    </HydrationBoundary>
  );
}
