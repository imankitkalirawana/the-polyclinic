import Organization from '@/components/dashboard/organizations/id';
import { getFullOrganization } from '@/services/api/organization';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface OrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['organization', id],
    queryFn: () => getFullOrganization({ organizationId: id }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Organization id={id} />
    </HydrationBoundary>
  );
}
