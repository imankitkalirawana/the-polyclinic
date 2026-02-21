import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import DashboardDoctor from '@/components/dashboard/doctors/doctor';
import { DoctorApi } from '@/services/client/doctor';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DashboardDoctorPage(props: Props) {
  const params = await props.params;
  const id = params.id;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await DoctorApi.getById(id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardDoctor id={id} />
    </HydrationBoundary>
  );
}
