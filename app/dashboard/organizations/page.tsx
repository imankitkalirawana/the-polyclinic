import Organizations from '@/components/dashboard/organizations';
import { listOrganizations } from '@/services/api/organization';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function OrganizationsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['organizations'],
    queryFn: async () => await listOrganizations(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Organizations />
    </HydrationBoundary>
  );
}
