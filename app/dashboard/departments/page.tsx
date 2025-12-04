import Departments from '@/components/dashboard/departments';
import { DepartmentApi } from '@/services/client/department';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function DepartmentsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await DepartmentApi.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialData: [],
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Departments />
    </HydrationBoundary>
  );
}
