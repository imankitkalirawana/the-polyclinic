import OrganizationsDashboard from '@/components/dashboard/organizations';
import { OrganizationApi } from '@/services/organization';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function OrganizationsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await OrganizationApi.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrganizationsDashboard />
    </HydrationBoundary>
  );
}
