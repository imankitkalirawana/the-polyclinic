import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import DashboardDoctor from '@/components/dashboard/doctors/doctor';
import { getDoctor } from '@/services/api/doctor';

interface Props {
  params: Promise<{
    uid: number;
  }>;
}

export default async function DashboardDoctorPage(props: Props) {
  const params = await props.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['doctor', params.uid],
    queryFn: async () => {
      const res = await getDoctor(params.uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardDoctor uid={params.uid} />
    </HydrationBoundary>
  );
}
