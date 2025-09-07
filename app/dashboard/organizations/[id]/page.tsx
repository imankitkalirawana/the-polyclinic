import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Organization from '@/components/dashboard/organizations/id';
import { OrganizationApi } from '@/services/system/organization';

interface OrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['organizations', id],
    queryFn: async () => {
      const res = await OrganizationApi.getById(id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Organization id={id} />
    </HydrationBoundary>
  );
}
