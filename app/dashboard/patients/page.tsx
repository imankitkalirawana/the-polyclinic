import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Patients from '@/components/dashboard/patients';
import { UserApi } from '@/services/common/user/user.api';

export default async function PatientPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await UserApi.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Patients />
    </HydrationBoundary>
  );
}
